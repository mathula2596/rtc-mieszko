import {connect} from "../../../../db/dbConfig"
import Rtc from "../../../../models/rtcModel"
import { NextResponse } from "next/server"
import { getUserType } from "@/helpers/getDataFromToken";
import User from "../../../../models/userModel";
import NotificationModel from "../../../../models/notificationModel";
import NotificationTokenModel from "../../../../models/notificationTokenModel";
import { getApp, getApps } from "firebase-admin/app";

connect()

var admin = require("firebase-admin");
var serviceAccount = require("../../../../../key.json");


export async function GET(request,{params}) {
    try {
        const {id} = params

        const rtc =  await Rtc.findOne({_id:id})
        return NextResponse.json({
            data:rtc,
            success:true
        })

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function PUT(request, { params }) {
    const FirebaseApp = getApps().length ? getApp() : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    try {
        const userRole = await getUserType(request)
        console.log(userRole)
        const { id } = params;
        const reqBody = await request.json();
        // console.log(userRole)
        if(userRole==="Admin")
        {
            console.log('admin true');
            const { department,price } = reqBody;
            const verificationData = "Pending Approval"
            // const isCompleted = true
            
            const rtc = await Rtc.findByIdAndUpdate(id, { department,price:price,verification:verificationData, priceDate:new Date() }, { new: true });
            // console.log(rtc)
            const superUser = await User.find({type:"Super"}).select("_id")
            // console.log(storeUser)

            const superUserArray = superUser.map(obj => (obj._id.toString() ));
            // const isReadArray = superUser.map(obj => ({ [obj._id.toString()]: false }));
            const isReadArray = superUser.map(obj => ({ 
                userId:obj._id.toString(),
                status: false
            }));
            // Convert the entire array to a JSON string
            // const userList = JSON.stringify(storeUserArray);

            // console.log(userList);
            const newNotification = new NotificationModel({
                rtc_id:id,
                message:"New Pending Approval List!",
                user_id:JSON.stringify(superUserArray),
                isRead:isReadArray,
                isActive:true,
                
            })
            // console.log(newNotification);

            await newNotification.save()

            const usersTokens = await NotificationTokenModel.find({user_id:{$in:superUserArray}}).select("token")
            const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
            console.log(tokenArray)
            if(usersTokens!=""){
    
                var message = {
                    notification:{
                        title:"RTC",
                        body:"New Pending Approval List"
                    },
                 
                    tokens:tokenArray
                };
                const sendMsg=await admin.messaging().sendEachForMulticast(message)
                    .then((response) => {
                        console.log('response send');
                        console.log(message);
                        // Response is a message ID string.
                        console.log('Successfully Admin sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error.message);
                });
                console.log('send messgae');
                console.log(sendMsg);
            }

            if (!rtc) {
                return NextResponse.json({ error: 'Rtc not found' }, { status: 404 });
            }
            return NextResponse.json({ message: 'Price updated',data:rtc, success: true });

            
    
        }
        else if(userRole==="Super"){
            const oldRtc = await Rtc.findOne({_id:id}).select()
            
            const { approvedPrice,verification,isPriceChanged } = reqBody;
            if(verification=="Rejected"){
                const rtc = await Rtc.findByIdAndUpdate(id, { verification:verification,approvedDate:new Date() }, { new: true });
                console.log(rtc)
                if (!rtc) {
                    return NextResponse.json({ error: 'Rtc not found' }, { status: 404 });
                }

                const storeUser = await User.find({store:{$regex:rtc.store}}).select("_id")
    
                const storeUserArray = storeUser.map(obj => (obj._id.toString() ));
                // const isReadArray = storeUser.map(obj => ({ [obj._id.toString()]: false }));
                const isReadArray = storeUser.map(obj => ({ 
                    userId:obj._id.toString(),
                    status: false
                }));
                const newNotification = new NotificationModel({
                    rtc_id:id,
                    message:"RTC Rejected!",
                    user_id:JSON.stringify(storeUserArray),
                    isRead:isReadArray,
                    isActive:true,
                    
                })
        
                await newNotification.save()

                const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
                const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
                console.log(tokenArray)
                
                if(usersTokens!=""){
        
                    var message = {
                        notification:{
                            title:"RTC",
                            body:"RTC Rejected"
                        },
                     
                        tokens:tokenArray
                    };
                    const sendMsg=await admin.messaging().sendEachForMulticast(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log('Successfully super rejected 1 sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                    });
                }
                return NextResponse.json({ message: 'RTC Rejected',data:rtc, success: true });


            }
            else{
                console.log(isPriceChanged)
               
                if(isPriceChanged){
                    let verificationData = "Approved"
                    if(oldRtc.price!=approvedPrice)
                    {
                        verificationData = "Approved with New Price"
                    }
                   
                    // const isCompleted = true
                    const count = oldRtc.count + 1;
                    const approvedPriceData = approvedPrice
                    const rtc = await Rtc.findByIdAndUpdate(id, {verification:verificationData,count:count,approvedPrice:approvedPriceData,approvedDate:new Date() }, { new: true });
                    // console.log(rtc)
                    if (!rtc) {
                        return NextResponse.json({ error: 'Rtc not found' }, { status: 404 });
                    }

                    const storeUser = await User.find({store:{$regex:rtc.store}}).select("_id")
    
                    const storeUserArray = storeUser.map(obj => (obj._id.toString() ));
                    // const isReadArray = storeUser.map(obj => ({ [obj._id.toString()]: false }));
                    const isReadArray = storeUser.map(obj => ({ 
                        userId:obj._id.toString(),
                        status: false
                    }));
                    const newNotification = new NotificationModel({
                        rtc_id:id,
                        message:verificationData,
                        user_id:JSON.stringify(storeUserArray),
                        isRead:isReadArray,
                        isActive:true,
                        
                    })
            
                    await newNotification.save()
                    const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
                    const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
                    console.log(tokenArray)
                    if(usersTokens!=""){
            
                        var message = {
                            notification:{
                                title:"RTC",
                                body:verificationData
                            },
                        
                            tokens:tokenArray
                        };
                        const sendMsg=await admin.messaging().sendEachForMulticast(message)
                            .then((response) => {
                                // Response is a message ID string.
                                console.log('Successfully sent approved 2 message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                        });
                    }

                    return NextResponse.json({ message: 'Approved with New Price',data:rtc, success: true });
                }
                else{
                    // const isCompleted = true
                    const count = oldRtc.count + 1;
                    const approvedPriceData = oldRtc.price
                    let verificationData = "Approved"
                    if(oldRtc.price!=approvedPrice)
                    {
                        verificationData = "Approved with New Price"
                    }
                    const rtc = await Rtc.findByIdAndUpdate(id, {verification:verificationData,count:count,approvedPrice:approvedPriceData,approvedDate:new Date() }, { new: true });
                    console.log(rtc)
                    if (!rtc) {
                        return NextResponse.json({ error: 'Rtc not found' }, { status: 404 });
                    }
                    const storeUser = await User.find({store:{$regex:rtc.store}}).select("_id")
    
                    const storeUserArray = storeUser.map(obj => (obj._id.toString() ));
                    // const isReadArray = storeUser.map(obj => ({ [obj._id.toString()]: false }));
                    const isReadArray = storeUser.map(obj => ({ 
                        userId:obj._id.toString(),
                        status: false
                    }));
                    const newNotification = new NotificationModel({
                        rtc_id:id,
                        message:verificationData,
                        user_id:JSON.stringify(storeUserArray),
                        isRead:isReadArray,
                        isActive:true,
                        
                    })

                    const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
                    const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
                    console.log(tokenArray)
                    if(usersTokens!=""){
            
                        var message = {
                            notification:{
                                title:"RTC",
                                body:verificationData
                            },
                        
                            tokens:tokenArray
                        };
                        const sendMsg=await admin.messaging().sendEachForMulticast(message)
                            .then((response) => {
                                // Response is a message ID string.
                                console.log('Successfully super approved 3 sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                        });
                    }
            
                    await newNotification.save()
                    return NextResponse.json({ message: 'Approved',data:rtc, success: true });
                }
                
            }
            
        }
        else{
            // const oldRtc = await Rtc.findOne({_id:id}).lean()
            const { barcode,name,department,updatedQty,expiry } = reqBody;
            // console.log(reqBody)  
            // const updatedQty = qty
            // const oldQty = oldRtc.qty
            const verificationValue = "Pending"
            const rtc = await Rtc.findByIdAndUpdate(id, { barcode,name,department,expiry,updatedQty:updatedQty,verification:verificationValue, dateCreated:new Date() }, { new: true });
    
            if (!rtc) {
                return NextResponse.json({ error: 'Rtc not found' }, { status: 404 });
            }
            const role = "Store"

            const storeUser = await User.find({store:{$regex:rtc.store},type:"Admin"}).select("_id")
    
            const storeUserArray = storeUser.map(obj => (obj._id.toString() ));
            // const isReadArray = storeUser.map(obj => ({ [obj._id.toString()]: false }));
            const isReadArray = storeUser.map(obj => ({ 
                userId:obj._id.toString(),
                status: false
            }));
            const newNotification = new NotificationModel({
                rtc_id:id,
                message:"RTC Qty Updated!",
                user_id:JSON.stringify(storeUserArray),
                isRead:isReadArray,
                isActive:true,
                
            })
    
            await newNotification.save()

            const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
            const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
            console.log(tokenArray)
            if(usersTokens!=""){
    
                var message = {
                    notification:{
                        title:"RTC",
                        body:"RTC Qty Updated"
                    },
                 
                    tokens:tokenArray
                };
                const sendMsg=await admin.messaging().sendEachForMulticast(message)
                    .then((response) => {
                        // Response is a message ID string.
                        console.log('Successfully store sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                });
            }

            
            return NextResponse.json({ message: 'RTC qty updated', success: true });

            // const store = savedRtc.status
            // sendNotification({ message: 'New record added!',data:{...rtc, role} });
    
        }
        // console.log(rtc);

        return NextResponse.json({ message: 'RTC qty updated', success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



