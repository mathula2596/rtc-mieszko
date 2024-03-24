import { getApp, getApps } from "firebase-admin/app";
import { connectToDatabase } from "../../../db/dbConfig";
import { WebSocketServer } from "ws";
import { initializeApp } from "firebase-admin";
import { NextResponse } from "next/server";

let connectedClients = [];
var admin = require("firebase-admin");
var serviceAccount = require("../../../../key.json");


// export async function POST(request) {
    
//     const FirebaseApp = getApps().length ? getApp() : initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//     });
//     try {
//         const reqBody = await request.json()
//         // console.log(reqBody)
//         const { payload,token} = reqBody
//         console.log(token)
//         console.log(payload)
//         // console.log(reqBody.notification)


//         var message = {
//             notification:{
//                 title: payload.notification.title,
//                 body: payload.notification.body,
//             },
            
//             tokens: [token]
//         };
//         const sendMsg= admin.messaging().sendEachForMulticast(message)
//             .then((response) => {
//                 // Response is a message ID string.

//                 console.log('Successfully sent message:', response);
//             })
//             .catch((error) => {
//                 console.log('Error sending message:', error);
//         });
//         console.log(sendMsg)

//         // Client.sendMessage(req.body.phoneNumber, req.body.message);
//         // res.send();
//         // const store = savedRtc.status
//         // sendNotification({ message: 'New record added!',data:{...savedRtc, role, store},role:role,store:store });
//         // broadcastNotification(newNotification);
//         return NextResponse.json({message:"Notification send!",success:true})
        

//     } catch (error) {
//         return NextResponse.json({error:error.message},{status:500})
//     }
// }