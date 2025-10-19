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
      <div className="flex-1 p-4 flex flex-col">
        {/* Add New User Button centered */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleAddUser}
            className="bg-black text-white px-6 py-2 rounded hover:bg-black"
          >
            Add New User
          </button>
        </div>

        {/* Graph */}
        <div className="flex-1">
          <Graph />
        </div>
      </div>
    </div>
  );
};
