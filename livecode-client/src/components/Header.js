
import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function Header({ users }) {
  const { id: groupId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const username = query.get("username") || "";

  return (
    <div className="w-full bg-gray-800 p-3 shadow-md flex justify-between items-center text-white">
      {/* Left Section → Project Title */}
      <div className="text-xl font-bold">
       🤝 NAMMA COLLABORATION
      </div>

      {/* Middle Section → Room ID */}
      <div className="text-md text-gray-300">
        Room ID: <span className="text-green-500 font-semibold">{groupId}</span>
      </div>

      {/* Right Section → Username */}
      <div className="text-xl text-purple-300 font-semibold">
        {username}
      </div>
      <div className="text-md">
        👍{users.length} online
      </div>
      
    </div>
  );
}