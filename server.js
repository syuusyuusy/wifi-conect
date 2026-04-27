import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = process.env.PORT || 3000;

// HTTP サーバーを作成
const server = app.listen(port, () => {
  console.log("Server running on port", port);
});

// WebSocket サーバーを HTTP サーバーに紐づける
const wss = new WebSocketServer({ server });

// クライアント接続時
wss.on("connection", (ws) => {
  console.log("Client connected");

  // keep-alive（切断防止）
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // メッセージ受信時
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

// 30 秒ごとに ping を送って接続維持
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
