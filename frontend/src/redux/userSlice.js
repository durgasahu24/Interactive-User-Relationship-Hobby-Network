import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  graph: { nodes: [], edges: [] },
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },

    setSuccess: (state) => {
      state.status = "succeeded";
      state.error = null;
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const updated = action.payload;
      const index = state.users.findIndex((u) => u._id === updated._id);
      if (index !== -1) state.users[index] = updated;
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setSuccess,
  setError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
} = usersSlice.actions;

export default usersSlice.reducer;
