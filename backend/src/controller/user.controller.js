import { calculatePopularity } from "../utils/calculatePopularity.js";
import User from "../models/user.model.js";
import redisClient from "../../db/redisClient.js";

export const getUsers = async (_req, res) => {
  try {
    const cachedUsers = await redisClient.get("users");

    if (cachedUsers) {
      console.log("Data from Redis cache");
      return res.json({ source: "cache", users: JSON.parse(cachedUsers) });
    }

    const users = await User.find();
    await redisClient.setEx("users", 60, JSON.stringify(users)); // Cache for 60s

    res.json({ source: "db", users });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {

  try {
    const { username, age, hobbies } = req.body;

    if (!username || !age || !hobbies) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newUser = new User({ username, age, hobbies });
    newUser.popularityScore = await calculatePopularity(newUser);
    await newUser.save();

    await redisClient.del("users");
    await redisClient.del("graph");

    res.status(201).json({ message: "New user created", newUser });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, req.body);
    user.popularityScore = await calculatePopularity(user);
    await user.save();

    await redisClient.del("users");
    await redisClient.del("graph");

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.friends.length > 0) {
      return res
        .status(409)
        .json({ message: "Unlink all friends before deleting" });
    }

    await User.findByIdAndDelete(req.params.id);

    await redisClient.del("users");
    await redisClient.del("graph");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const linkUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (id === friendId)
      return res.status(400).json({ message: "Cannot friend yourself" });

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User(s) not found" });

    if (user.friends.includes(friendId))
      return res.status(409).json({ message: "Already friends" });

    user.friends.push(friendId);
    friend.friends.push(id);

    user.popularityScore = await calculatePopularity(user);
    friend.popularityScore = await calculatePopularity(friend);

    await user.save();
    await friend.save();

    await redisClient.del("users");
    await redisClient.del("graph");

    res.json({ message: "Friendship created" });
  } catch (error) {
    console.error("Error in linkUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const unlinkUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User(s) not found" });

    user.friends = user.friends.filter(fid => fid.toString() !== friendId);
    friend.friends = friend.friends.filter(fid => fid.toString() !== id);

    user.popularityScore = await calculatePopularity(user);
    friend.popularityScore = await calculatePopularity(friend);

    await user.save();
    await friend.save();

    await redisClient.del("users");
    await redisClient.del("graph");

    res.json({ message: "Friendship removed" });
  } catch (error) {
    console.error("Error in unlinkUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGraph = async (_req, res) => {
  try {
    const cachedGraph = await redisClient.get("graph");
    if (cachedGraph) {
      console.log("Graph data from Redis cache");
      return res.json({ source: "cache", ...JSON.parse(cachedGraph) });
    }

    const users = await User.find();

    const nodes = users.map(u => ({
      id: u.id,
      data: { label: `${u.username} (${u.age})`, score: u.popularityScore },
    }));

    const edges = users.flatMap(u =>
      u.friends.map(fid => ({ id: `${u.id}-${fid}`, source: u.id, target: fid }))
    );

    const graph = { nodes, edges };

    await redisClient.setEx("graph", 60, JSON.stringify(graph));

    res.json({ source: "db", ...graph });
  } catch (error) {
    console.error("Error in getGraph:", error);
    res.status(500).json({ message: "Server error" });
  }
};
