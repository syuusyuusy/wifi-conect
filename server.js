import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const port = process.env.PORT || 3000;

// ★ HTTP サーバーを明示的に作成（これが重要）
const server = http.createServer(app);

// ★ WebSocket サーバーを HTTP サーバーに紐づける
const wss = new WebSocketServer({ server });

// ★ keep-alive（Render で切断されないために必須）
function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.isAlive = true;
  ws.on("pong", heartbeat);

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

// ★ 30秒ごとに ping を送って接続維持
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// ★ HTTP サーバーを起動
server.listen(port, () => {
  console.log("Server running on port", port);
});
