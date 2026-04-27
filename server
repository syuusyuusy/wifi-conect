import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Server running on port", port);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // 全クライアントに送信
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
