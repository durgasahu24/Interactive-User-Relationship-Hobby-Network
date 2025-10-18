import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const fetchHobbiesAPI = async () => {
  const res = await axios.get(`${API_BASE}/hobbies`);
  return res.data.data.hobbies;
};
