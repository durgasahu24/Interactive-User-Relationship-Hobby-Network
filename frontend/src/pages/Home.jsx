import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Graph } from "../components/Graph";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/user/new"); // redirect to create user form
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-2 flex flex-col ">
        {/* Add New User Button */}
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-40 mb-4"
        >
          Add New User
        </button>

        {/* Graph */}
        <div className="flex-1 mt-2">
          <Graph />
        </div>
      </div>
    </div>
  );
};
