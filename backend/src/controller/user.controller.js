import { calculatePopularity } from "../utils/calculatePopularity.js";
import User from "../models/user.model.js";

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
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

    res.status(201).json({message:"new user created ", newUser});

  } catch (error) {
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

    res.json({message:"user updated sucessfully",user});

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {

  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.friends.length > 0)
      return res
        .status(409)
        .json({ message: "Unlink all friends before deleting" });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully " });

  } catch (error) {
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

    res.json({ message: "Friendship created" });

  } catch (error) {
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

    res.json({ message: "Friendship removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getGraph = async (_req, res) => {

  try {

    const users = await User.find();

    const nodes = users.map(u => ({
      id: u.id,
      data: { label: `${u.username} (${u.age})`, score: u.popularityScore },
    }));

    const edges = users.flatMap(u =>
      u.friends.map(fid => ({
        id: `${u.id}-${fid}`,
        source: u.id,
        target: fid,
      }))
      
    );

    res.json({ nodes, edges });
    
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
