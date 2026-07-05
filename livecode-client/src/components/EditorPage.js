// src/components/EditorPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import Header from "./Header";
import ChatPanel from "./ChatPanel";
import LanguageSelector from "./LanguageSelector";

export default function EditorPage() {
  const { id: groupId } = useParams();
  const location=useLocation();
  const username = location.state?.username||"guest";

  const [code, setCode] = useState("//START YOUR CODING AND ENJOY");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [output, setOutput] = useState("");
  const [fullScreen, setFullScreen] = useState(false);


  // 🔹 Setup socket listeners
  useEffect(() => {
    socket.emit("join-room", { groupId, username });
    socket.on("users", setUsers);
    socket.on("code-update", setCode);
    socket.on("run-output", (data) => setOutput(data.output));
    socket.on("language-update", (newLang) => {
  setLanguage(newLang);
});

    return () => {
      socket.off("users");
      socket.off("code-update");
      socket.off("run-output");
      socket.off("language-update");
    };
  }, [groupId, username]);
  // Exit fullscreen on ESC
useEffect(() => {
  const exitHandler = (e) => {
    if (e.key === "Escape") {
      setFullScreen(false);
    }
  };

  window.addEventListener("keydown", exitHandler);
  return () => window.removeEventListener("keydown", exitHandler);
}, []);

  // 🔹 Code change handler
  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", { groupId, code: value });
  };

  // 🔹 Run code on backend
  const handleRun = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      setOutput(data.output || "No output");
      socket.emit("run-output", { groupId, output: data.output });
    } catch (err) {
      setOutput("❌ Error running code");
    }
  };

  // 🔹 Save code locally
  const handleSave = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code_${language}.txt`;
    a.click();
  };

  // 🔹 Share room link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Share link copied!");
  };

  // 🔹 File upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    const reader = new FileReader();
    reader.onload = (event) => setCode(event.target.result);
    reader.readAsText(uploadedFile);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-900 text-white">
      <Header users={users} />

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-800 p-3 shadow-md">
        <div className="flex items-center gap-3">
          <LanguageSelector language={language} setLanguage={setLanguage} />
          <input
            type="file"
            onChange={handleFileUpload}
            className="text-sm text-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={handleRun} className="bg-green-600 px-4 py-1 rounded-lg">
            ▶Run
          </button>
          <button onClick={handleSave} className="bg-yellow-600 px-4 py-1 rounded-lg">
            Save
          </button>
          <button onClick={handleShare} className="bg-blue-600 px-4 py-1 rounded-lg">
            Share
          </button>
           <button 
            onClick={() => setFullScreen(!fullScreen)} 
            className="bg-white-600 px-4 py-1 rounded-lg"
            >
            {fullScreen ? "Exit Full" : "⛶"}
          </button>
        </div>
      </div>

      {/* Editor + Output + Chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Editor & Output */}
        <div className="flex flex-col flex-1 p-3 overflow-hidden">
          <div className={fullScreen ? "fixed inset-0 z-50 bg-gray-900 p-2" : ""}>
           <Editor
             height={fullScreen ? "100vh" : "65vh"}
             theme="vs-dark"
             language={language}
             value={code}
             onChange={handleChange}
           />
        </div>
          {/* Output Terminal */}
          <div className="bg-black text-green-400 mt-2 p-2 h-40 overflow-auto rounded-lg border border-gray-700">
            <h3 className="font-semibold text-gray-300 mb-1">Output:</h3>
            <pre>{output}</pre>
          </div>
        </div>

        {/* Right side - Chat */}
        <ChatPanel groupId={groupId} username={username} />
      </div>
    </div>
  );
}