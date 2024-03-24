// import { connectToDatabase } from "../db/dbConfig";
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
let connectedClients = [];
const app = require('express')();
const cors = require('cors');

// app.use(cors({
//   origin:"http://localhost:3000" // Allow requests from this origin
//   // methods: ["GET", "POST"] // Allow only specified methods
// }));
const io = new Server(server, {
  cors: {
    origin:"http://localhost:3000" // Allow requests from this origin
    // methods: ["GET", "POST"] // Allow only specified methods
  },
  allowEIO3: true,
});

io.on('connection', async (socket) => {
  console.log('Client connected');
  connectedClients.push(socket.id);

  

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    connectedClients = connectedClients.filter((socket) => socket.id !== socket.id);
  });

//   socket.on('new_user_login',(data)=>{
//       console.log("new user loged in",data.message)
//       io.emit('new_user_login', {message:data.message});
//   })
  socket.on('test',async (data)=>{
    // const { db } = await connectToDatabase();

    // const changeStream = db.collection("notifications").watch();

    // changeStream.on("change", function (change) {
        
    //     if (change.operationType === "insert") {
    //         const newRecord = change.fullDocument;
    //         const message = JSON.stringify({ type: "newRecord", data: newRecord });
    //         // console.log("sdadasdadadasd")
    //         connectedClients.forEach((client) => {
    //             // client.send(message);
    //             // console.log(client)
    //         });
    //     }
    // });
  
    // console.log("test",data.message)
    io.emit('test', {message:data.message});
})
}); 
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
