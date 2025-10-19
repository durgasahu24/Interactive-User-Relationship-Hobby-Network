import { calculatePopularity } from "../utils/calculatePopularity.js";
import User from "../models/user.model.js";
import redisClient from "../../db/redisClient.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUsers = async (_req, res) => {
  try {
    const cachedUsers = await redisClient.get("users");

    if (cachedUsers) {
      console.log("Data from Redis cache");

      return ApiResponse.success(
        res,
        { users: JSON.parse(cachedUsers) },
        "Users fetched from cache"
      );
    }

    const users = await User.find();
    await redisClient.setEx("users", 60, JSON.stringify(users)); // Cache for 60s

    ApiResponse.success(res, { users }, "Users fetched from DB");
  } catch (error) {
    console.error("Error in getUsers:", error);
    ApiResponse.error(res, error.message);
  }
};

export const createUser = async (req, res) => {

  try {
    const { username, age, hobbies } = req.body;

    if (!username || !age || !hobbies) {
      return ApiResponse.validationError(res, null, "Missing fields");
    }

    const newUser = new User({ username, age, hobbies });
    newUser.popularityScore = await calculatePopularity(newUser);
    await newUser.save();

    await redisClient.del("users");
    await redisClient.del("graph");
          await redisClient.del("hobbies");

    ApiResponse.success(res, { newUser }, "New user created");
  } catch (error) {
    console.error("Error in createUser:", error);
    ApiResponse.error(res, error.message);
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    console.log("userid ", userId);

    const user = await User.findById(userId);
    if (!user) return ApiResponse.notFound(res, "User not found");

    Object.assign(user, req.body);
    user.popularityScore = await calculatePopularity(user);
    await user.save();

    await redisClient.del("users");
    await redisClient.del("graph");
          await redisClient.del("hobbies");

    ApiResponse.success(res, { user }, "User updated successfully");
  } catch (error) {
    console.error("Error in updateUser:", error);
    ApiResponse.error(res, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    console.log("user id ", userId);

    if (!userId) return ApiResponse.notFound(res, "ID not found");

    const user = await User.findById(userId);
    if (!user) return ApiResponse.notFound(res, "User not found");

    if (user.friends.length > 0) {
      return ApiResponse.conflict(res, "Unlink all friends before deleting", 409);
    }

    await User.findByIdAndDelete(userId);
    console.log("deleted");

    await redisClient.del("users");
    await redisClient.del("graph");
          await redisClient.del("hobbies");

    ApiResponse.success(res, {}, "User deleted successfully");
  } catch (error) {
    console.error("Error in deleteUser:", error);
    ApiResponse.error(res, error.message);
  }
};

export const linkUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    console.log("welcom to linkuser ", id, friendId);

    if (id === friendId)
      return ApiResponse.error(res, "Cannot friend yourself", 400);

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) return ApiResponse.notFound(res, "User(s) not found");

    if (user.friends.includes(friendId))
      return ApiResponse.conflict(res, "Already friends", 409);

    user.friends.push(friendId);
    friend.friends.push(id);

    user.popularityScore = await calculatePopularity(user);
    friend.popularityScore = await calculatePopularity(friend);

    await user.save();
    await friend.save();

    await redisClient.del("users");
    await redisClient.del("graph");
          await redisClient.del("hobbies");

    ApiResponse.success(res, {}, "Friendship created");
  } catch (error) {
    console.error("Error in linkUser:", error);
    ApiResponse.error(res, error.message);
  }
};

export const unlinkUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) return ApiResponse.notFound(res, "User(s) not found");

    if (!user.friends.includes(friendId)) {
      return ApiResponse.conflict(res, "No existing friendship to remove");
    }

    user.friends = user.friends.filter((fid) => fid.toString() !== friendId);
    friend.friends = friend.friends.filter((fid) => fid.toString() !== id);

    user.popularityScore = await calculatePopularity(user);
    friend.popularityScore = await calculatePopularity(friend);

    await user.save();
    await friend.save();

    await redisClient.del("users");
    await redisClient.del("graph");
          await redisClient.del("hobbies");

    ApiResponse.success(res, {}, "Friendship removed");
  } catch (error) {
    console.error("Error in unlinkUser:", error);
    ApiResponse.error(res, error.message);
  }
};


export const getGraph = async (_req, res) => {
  try {
    const cachedGraph = await redisClient.get("graph");
    if (cachedGraph) {
      console.log("Graph data from Redis cache");
      return ApiResponse.success(
        res,
        JSON.parse(cachedGraph),
        "Graph fetched from cache"
      );
    }

    const users = await User.find();

    const nodes = users.map((u) => ({
      id: u.id,
      data: { label: `${u.username} (${u.age})`, score: u.popularityScore },
    }));

    const edges = users.flatMap((u) =>
      u.friends.map((fid) => ({
        id: `${u.id}-${fid}`,
        source: u.id,
        target: fid,
      }))
    );

    const graph = { nodes, edges };

    await redisClient.setEx("graph", 60, JSON.stringify(graph));

    ApiResponse.success(res, graph, "Graph fetched from DB");
  } catch (error) {
    console.error("Error in getGraph:", error);
    ApiResponse.error(res, error.message);
  }
};

export const getHobbies = async (req, res) => {
  try {
    const cachedHobbies = await redisClient.get("hobbies");
    if (cachedHobbies) {
      console.log("Hobbies from Redis cache");
      return ApiResponse.success(
        res,
        JSON.parse(cachedHobbies),
        "Hobbies fetched from cache"
      );
    }

    // Get distinct hobbies from DB
    const hobbies = await User.distinct("hobbies");

    // Cache for 60 seconds
    await redisClient.setEx("hobbies", 60, JSON.stringify(hobbies));

    ApiResponse.success(res, hobbies, "Hobbies fetched from DB");
  } catch (error) {
    console.error("Error in getHobbies:", error);
    ApiResponse.error(res, error.message);
  }
};




export const addHobbyToUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    const { hobby } = req.body;

    if (!hobby) return ApiResponse.validationError(res, null, "Hobby is required");

    const user = await User.findById(userId);
    if (!user) return ApiResponse.notFound(res, "User not found");

    // Add hobby if not already in user's list
    if (!user.hobbies.includes(hobby)) {
      user.hobbies.push(hobby);
      user.popularityScore = await calculatePopularity(user);
      console.log("user  pop",user);
      await user.save();

      // Clear relevant caches
      await redisClient.del("users");
      await redisClient.del("graph");
      await redisClient.del("hobbies");

      ApiResponse.success(res, { user }, "Hobby added and popularity updated");

    } else {
      ApiResponse.conflict(res, "Hobby already exists", 409);
    }
  } catch (error) {
    console.error("Error in addHobbyToUser:", error);
    ApiResponse.error(res, error.message);
  }
};
