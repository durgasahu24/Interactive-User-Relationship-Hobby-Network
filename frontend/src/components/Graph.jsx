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
import { fetchUsersAPI, deleteUserAPI, linkUserAPI } from "../hooks/UseUserGet";
import { unlinkUserAPI } from "../hooks/UseUserGet";
import { LowScoreNode } from "./LowerScoreNode";
import { HighScoreNode } from "./HighScoreNode";
import { getHobbiesApi } from "../hooks/UseUserGet";
import { setHobbies } from "../redux/hobbiesSlice";
import { useNavigate } from "react-router-dom";

const nodeTypes = {
  highScoreNode: HighScoreNode,
  lowScoreNode: LowScoreNode,
};

export const Graph = () => {
  const dispatch = useDispatch();
  const { graph, users } = useSelector((state) => state.users);
  const navigate = useNavigate();
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
      const nodeType = u.popularityScore > 5 ? "highScoreNode" : "lowScoreNode";

      return {
        id: u._id,
        type: nodeType,
        data: {
          label: `${u.username} (${u.age})`,
          score: u.popularityScore,
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
          animated: true,
        }))
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [users]);

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

  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const user = users.find((u) => u._id === n.id);
        if (!user) return n;

        const newType =
          user.popularityScore > 5 ? "highScoreNode" : "lowScoreNode";

        return {
          ...n,
          type: newType,
          data: {
            ...n.data,
            label: `${user.username} (${user.age})`,
            score: user.popularityScore,
          },
        };
      })
    );
  }, [users]);

  const handleDelete = (userId) => 
     {
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
                const updatedHobbies = await getHobbiesApi();
                dispatch(setHobbies(updatedHobbies));
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

  const handleEdit = (user) => {
    navigate(`/user/${user._id}`);
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
  const onConnect = useCallback(
    async (connection) => {
      const { source, target } = connection;
      try {
        await linkUserAPI(source, target);
        const updatedUsers = await fetchUsersAPI();
        dispatch(setUsers(updatedUsers));
        setEdges((eds) => addEdge(connection, eds));
        toast.success("Friendship created!");
      } catch (err) {
        console.error("Failed to link users:", err);
        toast.error("Failed to create friendship");
      }
    },
    [dispatch]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete) => {
      for (const edge of edgesToDelete) {
        const { source, target } = edge;

        console.log("source target ", source, target);

        try {
          // Call backend to unlink users
          await unlinkUserAPI(source, target);
          const updatedUsers = await fetchUsersAPI();
          dispatch(setUsers(updatedUsers));
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
    },
    [dispatch]
  );

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
