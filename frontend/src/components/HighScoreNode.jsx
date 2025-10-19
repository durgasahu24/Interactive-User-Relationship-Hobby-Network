import React from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setUsers } from "../redux/userSlice";
import { addUserHobbyAPI } from "../hooks/UseUserApi";

export const HighScoreNode = ({ data, id }) => {
  const { setNodes } = useReactFlow();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  // Allow drag-drop
  const allowDrop = (e) => e.preventDefault();

  // Handle hobby drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData("hobby");
    if (!hobby) return;

    try {
      const updatedUser = await addUserHobbyAPI(id, hobby);

      // Update node locally
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, hobbies: updatedUser.hobbies, score: updatedUser.popularityScore } }
            : n
        )
      );

      // Update Redux
      const updatedUsers = users.map((u) => (u._id === id ? updatedUser : u));
      dispatch(setUsers(updatedUsers));

      toast.success("Hobby added successfully!");
    } catch (err) {
      console.error("Failed to add hobby:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Error adding hobby");
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={allowDrop}
      className="p-2 rounded-md border-2 shadow-md text-sm text-center"
      style={{
        borderColor: "#16a34a",
        background: "linear-gradient(135deg, #dcfce7, #a7f3d0)",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="font-semibold text-green-800">{data.label}</div>
      <div className="text-xs text-green-700 mt-1">
        Popularity: {data.score ?? "N/A"}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        <button
          onClick={data.onEdit}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
        >
          Edit
        </button>
        <button
          onClick={data.onDelete}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
