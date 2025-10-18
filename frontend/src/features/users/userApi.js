import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const fetchUsersAPI = async () => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data.data.users;
};

export const createUserAPI = async (user) => {
  const res = await axios.post(`${API_BASE}/users`, user);
  return res.data.data.newUser;
};
