import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

// Fetch all users
export const fetchUsersAPI = async () => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data.data.users;
};

// Create a new user
export const createUserAPI = async (user) => {
  const res = await axios.post(`${API_BASE}/users`, user);
  return res.data.data.newUser;
};

// Update a user by ID
export const updateUserAPI = async (id, updates) => {
  const res = await axios.put(`${API_BASE}/users/${id}`, updates);
  return res.data.data.user;
};

// Add hobby to a user
export const addUserHobbyAPI = async (userId, hobby) => {
  if (!userId || !hobby) throw new Error("User ID and hobby are required");

  const res = await axios.put(`${API_BASE}/users/${userId}/hobby`, { hobby });
  return res.data.data.user; // returns updated user object
};

// Delete a user by ID
export const deleteUserAPI = async (id) => {
  await axios.delete(`${API_BASE}/users/${id}`);
  return id;
};

// Link two users (create friendship)
export const linkUserAPI = async (id, friendId) => {
  const res = await axios.post(`${API_BASE}/users/${id}/link`, { friendId });
  return res.data;
};

// Unlink two users (remove friendship)
export const unlinkUserAPI = async (id, friendId) => {
  const res = await axios.delete(`${API_BASE}/users/${id}/unlink`, {
    data: { friendId },
  });
  return res.data;
};

// Fetch all hobbies
export const getHobbiesApi = async () => {
  const res = await axios.get(`${API_BASE}/hobbies`);
  return res.data.data;
};


