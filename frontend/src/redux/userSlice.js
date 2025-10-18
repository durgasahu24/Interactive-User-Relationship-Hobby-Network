// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   users: [],
//   graph: { nodes: [], edges: [] },
//   status: 'idle', 
//   error: null,    
// };

// // ========== 🔹 SLICE ==========
// const userSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     // Set all users at once
//     setUsers: (state, action) => {
//       state.users = action.payload;
//     },

//     // Add a single user
//     addUser: (state, action) => {
//       state.users.push(action.payload);
//     },

//     // Update a user by id
//     updateUser: (state, action) => {
//       const updated = action.payload;
//       const index = state.users.findIndex((u) => u._id === updated._id);
//       if (index !== -1) state.users[index] = updated;
//     },

//     // Delete a user by id
//     deleteUser: (state, action) => {
//       state.users = state.users.filter((u) => u._id !== action.payload);
//     },

//     // Set graph data
//     setGraph: (state, action) => {
//       state.graph = action.payload;
//     },

//     // Clear all data
//     clearAll: (state) => {
//       state.users = [];
//       state.graph = { nodes: [], edges: [] };
//       state.status = 'idle';
//       state.error = null;
//     },
//   },
// });

// // ========== 🔹 EXPORTS ==========
// export const { setUsers, addUser, updateUser, deleteUser, setGraph, clearAll } = userSlice.actions;
// export default userSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   users: [],
//   graph: { nodes: [], edges: [] },
//   status: 'idle',
//   error: null,
// };

// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     setUsers: (state, action) => {
//       state.users = action.payload;
//     },
//     addUser: (state, action) => {
//       state.users.push(action.payload);
//     },
//     setGraph: (state, action) => {
//       state.graph = action.payload;
//     },
//     clearAll: (state) => {
//       state.users = [];
//       state.graph = { nodes: [], edges: [] };
//       state.status = 'idle';
//       state.error = null;
//     },
//     updateUserHobbies: (state, action) => {
//       const { userId, hobby } = action.payload;
//       const user = state.users.find((u) => u._id === userId);
//       if (user) {
//         user.hobbies = user.hobbies ? [...user.hobbies, hobby] : [hobby];
//       }
//     },
//   },
// });

// export const { setUsers, addUser, setGraph, clearAll, updateUserHobbies } = usersSlice.actions;
// export default usersSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  graph: { nodes: [], edges: [] },
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set all users at once
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    // Add a single user
    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    // Update a user by id
    updateUser: (state, action) => {
      const updated = action.payload;
      const index = state.users.findIndex((u) => u._id === updated._id);
      if (index !== -1) state.users[index] = updated;
    },

    // Delete a user by id
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },

    // Update hobbies of a user (for drag-and-drop)
    updateUserHobbies: (state, action) => {
      const { userId, hobby } = action.payload;
      const user = state.users.find((u) => u._id === userId);
      if (user) {
        user.hobbies = user.hobbies ? [...user.hobbies, hobby] : [hobby];
      }
    },

    // Set graph (nodes + edges)
    setGraph: (state, action) => {
      state.graph = action.payload;
    },

    // Clear all data
    clearAll: (state) => {
      state.users = [];
      state.graph = { nodes: [], edges: [] };
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  updateUserHobbies,
  setGraph,
  clearAll,
} = usersSlice.actions;

export default usersSlice.reducer;
