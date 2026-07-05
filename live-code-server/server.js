const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

// ✅ Handle Socket.IO connections (Chat + Code Sync)
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("join-room", ({ groupId, username }) => {
    socket.join(groupId);
    socket.username = username;
    console.log(`👋 ${username} joined room ${groupId}`);

    const usersInRoom = Array.from(io.sockets.adapter.rooms.get(groupId) || []).map(
      (id) => io.sockets.sockets.get(id)?.username
    );
    io.to(groupId).emit("users", usersInRoom);
  });

  socket.on("code-change", ({ groupId, code }) => {
    socket.to(groupId).emit("code-update", code);
  });
  socket.on("language-update",({groupId,newLang}) => {
    console.log(`language changed to ${newLang} in room ${groupId}`);
    socket.to(groupId).emit("language-update",newLang);
  });

 socket.on("chat-message", ({ groupId, username, message }) => {
  const msg = {
    user: username,
    text: message,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  console.log(`💬 ${username} in ${groupId}: ${message}`);
  io.to(groupId).emit("chat-message", msg);
});
// ✅ When one user runs the code, broadcast the output to everyone in the room
socket.on("run-output", ({ groupId, output }) => {
  console.log(`🧠 Run result shared in room ${groupId}`);
  socket.to(groupId).emit("run-output", { output });
});

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


// ✅ Route to run code
app.post("/run", (req, res) => {
  const { language, code } = req.body;
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  let runCommand = "";
  let filePath = "";

  switch (language.toLowerCase()) {
    case "python":
      filePath = path.join(tempDir, "temp.py");
      fs.writeFileSync(filePath, code);
      runCommand = `"C:\\Users\\HAMSA P\\anaconda3\\python.exe" "${filePath}"`;
      break;

    case "javascript":
      filePath = path.join(tempDir, "temp.js");
      fs.writeFileSync(filePath, code);
      runCommand = `node "${filePath}"`;
      break;

    case "c":
      filePath = path.join(tempDir, "temp.c");
      fs.writeFileSync(filePath, code);
      runCommand = `gcc "${filePath}" -o "${tempDir}/a.exe" && "${tempDir}/a.exe"`;
      break;

    case "cpp":
    case "c++":
      filePath = path.join(tempDir, "temp.cpp");
      fs.writeFileSync(filePath, code);
      runCommand = `g++ "${filePath}" -o "${tempDir}/a.exe" && "${tempDir}/a.exe"`;
      break;

    case "java":
      filePath = path.join(tempDir, "Main.java");
      fs.writeFileSync(filePath, code);
      runCommand = `cd "${tempDir}" && javac Main.java && java Main`;
      break;

    case "html":
    case "css":
      // For HTML/CSS, just return code as "preview"
      return res.json({
        output: `📄 ${language.toUpperCase()} preview mode (no execution)\n\n${code}`,
      });

    default:
      return res.json({ output: "⚠ Language not supported yet." });
  }

  exec(runCommand, (error, stdout, stderr) => {
    if (error) {
      return res.json({ output:`❌ Error: ${stderr || error.message}`});
    }
    res.json({ output: stdout || "✅ Code executed successfully" });
  });
});

// ✅ Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🟢 Socket.IO + Code Execution server started successfully!");
});