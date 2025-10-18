import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

// Fetch all users
export const fetchUsersAPI = async () => {
  const res = await axios.get(`${API_BASE}/users`, { withCredentials: true });
  return res.data.data.users;
};

// Create a new user
export const createUserAPI = async (user) => {
  const res = await axios.post(`${API_BASE}/users`, user, { withCredentials: true });
  return res.data.data.newUser;
};

// Update a user by ID
export const updateUserAPI = async (id, updates) => {
  const res = await axios.put(`${API_BASE}/users/${id}`, updates, { withCredentials: true });
  
  return res.data.data.user;
};

// Delete a user by ID
export const deleteUserAPI = async (id) => {
  await axios.delete(`${API_BASE}/users/${id}`, { withCredentials: true });
  return id;
};


export const linkUserAPI = async (id, friendId) => {
  console.log("id",id);
  console.log("friend ",friendId);
  const res = await axios.post(
    `http://localhost:8000/api/v1/users/${id}/link`,
    { friendId },
    { withCredentials: true }
  );
  console.log("res ",res);
  return res.data;
};

export const unlinkUserAPI = async (id, friendId) => {
  console.log("id", id);
  console.log("friend ", friendId);

  const res = await axios.delete(
    `http://localhost:8000/api/v1/users/${id}/unlink`,
    {
      data: { friendId }, 
      withCredentials: true,
    }
  );

  console.log("res ", res);
  return res.data;
};


