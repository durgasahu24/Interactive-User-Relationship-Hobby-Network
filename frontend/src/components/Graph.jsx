import React, { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector, useDispatch } from "react-redux";
import { setGraph, setUsers } from "../redux/userSlice";
import {
  fetchUsersAPI,
  deleteUserAPI,
  updateUserAPI,
  linkUserAPI,
} from "../hooks/UseUserGet";
import { CustomNode } from "./CustomNode";
import { unlinkUserAPI } from "../hooks/UseUserGet";

const nodeTypes = { customNode: CustomNode };

export const Graph = () => {
  const dispatch = useDispatch();
  const { graph, users } = useSelector((state) => state.users);

  const [nodes, setNodes] = useState(graph.nodes);
  const [edges, setEdges] = useState(graph.edges);

  // Create nodes and edges
  useEffect(() => {
    const nodesPerRow = 4;
    const xSpacing = 200;
    const ySpacing = 150;

    const newNodes = users.map((u, idx) => {
      const row = Math.floor(idx / nodesPerRow);
      const col = idx % nodesPerRow;

      return {
        id: u._id,
        type: "customNode",
        data: {
          label: `${u.username} (${u.age})`,
          onDelete: () => handleDelete(u._id),
          onEdit: () => handleEdit(u),
        },
        position: { x: col * xSpacing, y: row * ySpacing },
      };
    });

    const newEdges = users.flatMap((u) =>
      u.friends
        .filter((fid) => u._id < fid) 
        .map((fid) => ({
          id: `${u._id}-${fid}`,
          source: u._id,
          target: fid,
          animated:true
        }))
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [users]);

  const handleDelete = (userId) => {
    // Show toast confirmation
    toast((t) => (
      <div className="p-2">
        <p>Are you sure you want to delete this user?</p>
        <div className="mt-2 flex gap-2 justify-center">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // close the confirmation toast
              try {
                await deleteUserAPI(userId);
                const updated = users.filter((u) => u._id !== userId);
                dispatch(setUsers(updated));
                toast.success("User deleted successfully!");
              } catch (err) {
                console.error("Delete failed:", err);
                toast.error(
                  err.response?.data?.message || "Failed to delete user"
                );
              }
            }}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // cancel
            className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  // Edit user
  const handleEdit = async (user) => {
    const newName = prompt("Enter new username:", user.username);
    const newAge = prompt("Enter new age:", user.age);
    if (!newName || !newAge) return;

    try {
      await updateUserAPI(user._id, { username: newName, age: newAge });
      const updatedUsers = users.map((u) =>
        u._id === user._id ? { ...u, username: newName, age: newAge } : u
      );
      dispatch(setUsers(updatedUsers));
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update user");
    }
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Connect two users (create friendship)
  const onConnect = useCallback(async (connection) => {
    setEdges((eds) => addEdge(connection, eds));

    const { source, target } = connection;
    try {
      await linkUserAPI(source, target);
      toast.success("Friendship created!");
    } catch (err) {
      console.error("Failed to link users:", err);
      toast.error("Failed to create friendship");
    }
  }, []);

  // Fetch users initially
  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const users = await fetchUsersAPI();
        dispatch(setUsers(users));
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };
    fetchOtherUsers();
  }, [dispatch]);

  const onEdgesDelete = useCallback(async (edgesToDelete) => {
    for (const edge of edgesToDelete) {
      const { source, target } = edge;

      console.log("source target ", source, target);

      try {
        // Call backend to unlink users
        await unlinkUserAPI(source, target);
        toast.success(`Friendship removed`);
      } catch (err) {
        console.error("Failed to unlink users:", err);
        toast.error(err.response?.data?.message || "Failed to unlink users");
      }
    }

    // Remove edges visually
    setEdges((eds) =>
      eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id))
    );
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
