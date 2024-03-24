import { connect } from "../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Rtc from "../../../models/rtcModel";
import { getDataFromToken, getUserStore, getUserStores, getUserType } from "../../../helpers/getDataFromToken";
import NotificationModel from "../../../models/notificationModel";
import User from "../../../models/userModel";
import NotificationTokenModel from "../../../models/notificationTokenModel";
// import FirebaseApp from "../firebase/Firebase";
import { getApp, getApps, initializeApp } from "firebase-admin/app";

connect()
var admin = require("firebase-admin");
var serviceAccount = require("../../../../key.json");

export async function GET(request) {
    try {
        const userRole = await getUserType(request)
        // console.log(userRole)
        if(userRole=="Super")
        {
            const rtcs =  await Rtc.find({isActive:true}).sort({created_at: -1});
            return NextResponse.json({
                data:rtcs,
                success:true
            })
        }
        else if(userRole=="Store")
        {
            const store = await getUserStore(request)
            const rtcs =  await Rtc.find({store:store,isActive:true}).sort({created_at: -1});
            return NextResponse.json({
                data:rtcs,
                success:true
            })
        }
        else{
            const stores = await getUserStores(request)
            // console.log(stores)

            const rtcs =  await Rtc.find({store: { $in: stores },isActive:true}).sort({created_at: -1});
            return NextResponse.json({
                data:rtcs,
                success:true
            })
        }

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function POST(request) {
    // FirebaseApp
    // debugger
    const FirebaseApp = getApps().length ? getApp() : initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    try {
        const reqBody = await request.json()
        const { barcode,name,department,qty,expiry} = reqBody
        const store = await getUserStore(request)
        const userID = await getDataFromToken(request)
        // console.log(store)
        const verificationValue = "Pending"
        const countValue = 0;
        const newRtc = new Rtc({
            barcode,
            name,
            department,
            qty,
            updatedQty:qty,
            expiry,
            store,
            count:countValue,
            verification:verificationValue,
            dateCreated:new Date(),
            userID

        })

        const savedRtc = await newRtc.save()

        const storeUser = await User.find({store:{$regex:store},type:"Admin"}).select("_id")
        // console.log(storeUser)

        const storeUserArray = storeUser.map(obj => (obj._id.toString() ));
        const isReadArray = storeUser.map(obj => ({ 
            userId:obj._id.toString(),
            status: false
        }));
        
        const newNotification = new NotificationModel({
            rtc_id:savedRtc._id,
            message:"New RTC Record Created!",
            user_id:JSON.stringify(storeUserArray),
            isRead:isReadArray,
            isActive:true,
            
        })

        await newNotification.save()
        // console.log(newNotification);

        // console.log("dasdasdasdasdasdasdasdasdasd")
        const role = "Store"
        const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
        const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
        // console.log(tokenArray)
        if(usersTokens!=""){

            var message = {
                notification:{
                    title:"RTC",
                    body:"New Record"
                },
             
                tokens:tokenArray
            };
            const sendMsg=await admin.messaging().sendEachForMulticast(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
            });
            // console.log(sendMsg)
        }

        // Client.sendMessage(req.body.phoneNumber, req.body.message);
        // res.send();
        // const store = savedRtc.status
        // sendNotification({ message: 'New record added!',data:{...savedRtc, role, store},role:role,store:store });
        // broadcastNotification(newNotification);
        return NextResponse.json({message:"New RTC Record Created!",rtc:savedRtc,success:true,storeUser:storeUser[0]._id})
        

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function PUT(request) {
    try {
        const reqBody = await request.json();
        reqBody.forEach(async (item) => {
            // console.log(item._id)
            const oldRtc = await Rtc.findOne({_id:item._id}).select()
            const count = oldRtc.count + 1;
            const approvedPriceData = oldRtc.price
            const verificationData = "Approved"
            const rtc = await Rtc.findByIdAndUpdate(item._id, {verification:verificationData,count:count,approvedPrice:approvedPriceData,approvedDate:new Date() }, { new: true });
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
                rtc_id:item._id,
                message:verificationData,
                user_id:JSON.stringify(storeUserArray),
                isRead:isReadArray,
                isActive:true,
                
            })
    
            await newNotification.save()

            const usersTokens = await NotificationTokenModel.find({user_id:{$in:storeUserArray}}).select("token")
            const tokenArray = usersTokens.map(obj => (obj.token.toString() ));
            // console.log(tokenArray)
            const FirebaseApp = getApps().length ? getApp() : initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

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
                        console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                });
            }


            return NextResponse.json({ message: 'Approved All',data:rtc, success: true });
        });
       
    

        return NextResponse.json({ message: 'RTC price approved', success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}