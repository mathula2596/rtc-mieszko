import { connectToDatabase } from "../../../db/dbConfig";
import { WebSocketServer } from "ws";

let connectedClients = [];

export default async function handler(req, res) {
    if (req.method === "GET") {
        const wss = new WebSocketServer({ noServer: true });

        wss.on("connection", function connection(ws) {
            connectedClients.push(ws);

            ws.on("close", function () {
                connectedClients = connectedClients.filter((client) => client !== ws);
            });
        });

        const { db } = await connectToDatabase();

        const changeStream = db.collection("notifications").watch();

        changeStream.on("change", function (change) {
            if (change.operationType === "insert") {
                const newRecord = change.fullDocument;
                const message = JSON.stringify({ type: "newRecord", data: newRecord });

                // connectedClients.forEach((client) => {
                //     client.send(message);
                // });
            }
        });

        res.status(200).end();
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
