import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hobbies: [],
};

const hobbiesSlice = createSlice({
  name: 'hobbies',
  initialState,
  reducers: {
    setHobbies: (state, action) => {
      state.hobbies = action.payload;
    },
  },
});

export const { setHobbies} = hobbiesSlice.actions;
export default hobbiesSlice.reducer;
