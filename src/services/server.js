// import { connectToDatabase } from "../db/dbConfig";

// const { connectToDatabase } = require('../db/dbConfig');

const http = require('http');
const socketIo  = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');

let connectedClients = [];

const cors = require('cors');
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only http://localhost:3000 to access
  credentials: true, // Reflect the request's credentials mode
};
app.use(cors(corsOptions));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin:"http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"] // Allow only specified methods
  },
  allowEIO3: true,
});


mongoose.connect("mongodb+srv://mathula:GG27nURVBnV7FWDC@cluster1.nfafupw.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');

  // Now that we are connected, start the Socket.IO server and listen for connections
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for a 'test' event from clients
    socket.on('test', async (data) => {
      // Assuming 'notifications' collection exists and we want to watch it for changes
      const changeStream = db.collection("notifications").watch();

      changeStream.on("change", (change) => {
        console.log("Change detected:", change.operationType);
        if (change.operationType === "insert") {
          const newRecord = change.fullDocument;
          const message = JSON.stringify({ type: "newRecord", data: newRecord });
          console.log("New record added:", message);

          // Emit a message to all connected clients
          io.emit('test', { message: "New record added." });
        }
        if (change.operationType === "update") {
          const newRecord = change.fullDocument;
          const message = JSON.stringify({ type: "recodeupdated", data: newRecord });
          console.log("Record updated:", message);

          // Emit a message to all connected clients
          io.emit('test', { message: "Record updated." });
        }
      });
    });
  });
});

// io.on('connection', async (socket) => {
//   console.log('Client connected');
//   connectedClients.push(socket.id);


//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     connectedClients = connectedClients.filter((socket) => socket.id !== socket.id);
//   });

// //   socket.on('new_user_login',(data)=>{
// //       console.log("new user loged in",data.message)
// //       io.emit('new_user_login', {message:data.message});
// //   })
//   socket.on('test',async (data)=>{
//     mongoose.connect(process.env.MONGO_URI)
//     // const connection = mongoose.connection
//     const dbs = mongoose.connection.db;
//     // const { db } = await connectToDatabase();

//     const changeStream = dbs.collection("notifications").watch();
//     console.log("sdadasdadadasd")

//     changeStream.on("change", function (change) {
//       console.log("sdadasdadadasd")
        
//         if (change.operationType === "insert") {
//             const newRecord = change.fullDocument;
//             const message = JSON.stringify({ type: "newRecord", data: newRecord });
//             console.log("sdadasdadadasd")
//             connectedClients.forEach((client) => {
//                 // client.send(message);
//                 // console.log(client)
//             });
//         }
//     });
  
//     // console.log("test",data.message)
//     io.emit('test', {message:"data.message"});
// })
// }); 
// socket.on('send_notification',(notification)=>{
//       console.log(notification)
//       io.emit('send_notification', notification.message);
//   })


// Function to send notifications to connected clients
// function sendNotification(notification) {
//     const { role, store } = notification.data;
//     io.emit('notification', notification);
// }

// function sendNotificationToUsers(notification) {
//   // const { user_id, isRead } = notification;
  
//   // // Filter users based on their isRead status
//   // const usersToNotify = user_id.filter(userId => !isRead[userId]);
  
//   // // Emit the notification to connected clients belonging to the users to notify
//   // usersToNotify.forEach(userId => {
//   //   const socketId = // Retrieve socket ID for the user from a mapping or database
//     io.emit('send_notification', notification);
//   // });
// }

server.listen(3005, () => {
  console.log('Socket.IO server listening on port 3005');
});

// module.exports = { sendNotification,sendNotificationToUsers };
