import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const JoinGroup = () => {
    if (!roomId || !username) {
      alert("Please enter both Room ID and Username");
      return;
    }
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const CreateGroup = () => {
    const id = Math.random().toString(36).substring(2, 8);
    setRoomId(id);
    alert(`New room created! Room ID: ${id}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

      {/* Glass effect box */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-96 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">NAMMA COLLAB</h1>

        {/* Room ID */}
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={JoinGroup}
            className="flex-1 bg-purple-500 hover:bg-purple-600 transition text-white font-semibold py-2 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={CreateGroup}
            className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;