import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hobbies: ["studing","reading","dancing"],
};

const hobbiesSlice = createSlice({
  name: 'hobbies',
  initialState,
  reducers: {
    setHobbies: (state, action) => {
      state.hobbies = action.payload;
    },
    addHobby: (state, action) => {
      state.hobbies.push(action.payload);
    },
  },
});

export const { setHobbies, addHobby } = hobbiesSlice.actions;
export default hobbiesSlice.reducer;
