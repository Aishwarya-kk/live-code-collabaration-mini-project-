import React, { useState, useEffect } from "react";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";

export default function ChatPanel({ groupId, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);

  useEffect(() => {
    // ✅ Listen for chat messages from server
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    // ✅ Send only to backend (not add locally)
    socket.emit("chat-message", {
      groupId,
      username: username || "Guest",
      message: input,
    });

    setInput(""); // clear input
  };

  return (
    <div className="w-80 bg-[#1e293b] flex flex-col border-l border-gray-700">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-200">💬 Team Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm text-center mt-4">
            No messages yet. Start chatting 💭
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.user===username?"justify-end":"justify-start"}`}>
            <div
  className={`p-2 rounded-xl max-w-[80%] ${
    m.user === username
      ? "bg-blue-600 text-white rounded-br-none"
      : "bg-gray-700 text-white rounded-bl-none"
  }`}
>
  {m.user !== username && (
    <div className="text-sm font-semibold text-blue-300">
      {m.user || "Guest"}
    </div>
  )}
  <div className="text-sm">{m.text}</div>
  <div className="text-xs text-gray-300 text-right mt-1">
    {m.time ||
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
  </div>
</div>
          </div>
        ))}
      </div>

      {/* Input */}
     <div className="border-t border-gray-700 p-3 flex items-center space-x-2 relative">
  {/* Emoji picker toggle button */}
  <div className="relative">
  <button
    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    className="text-xl text-yellow-400"
  >
    🤝
  </button>

  {/* Emoji picker popup */}
  {showEmojiPicker && (
    <div className="absolute bottom-full right-0 mb-2 z-50">
      <EmojiPicker
        theme="cream"
        onEmojiClick={(emoji) => setInput((prev) => prev + emoji.emoji)}
      />
    </div>
  )}
</div>
  {/* Input box */}
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    className="flex-1 bg-[#0f172a] text-gray-200 text-sm p-2 rounded focus:outline-none"
    placeholder="Type a message..."
  />

  {/* Send button */}
  <button
    onClick={sendMessage}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
  >
    Send
  </button>
</div>
    </div>
  );
}