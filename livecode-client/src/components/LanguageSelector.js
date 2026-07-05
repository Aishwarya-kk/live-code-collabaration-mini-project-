// src/components/LanguageSelector.jsx
import React from "react";
import socket from "../socket";

export default function LanguageSelector({ language, setLanguage }) {
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const groupId = window.location.pathname.split("/").pop(); // extract groupId from URL
    socket.emit("language-update", {groupId, newLang}); // 🔹 send to backend
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="bg-gray-700 text-white px-2 py-1 rounded-lg"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
      <option value="c">C</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
    </select>
  );
}