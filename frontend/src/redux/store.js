import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice';
import hobbiesReducer from './hobbiesSlice';

 const store = configureStore({
  reducer: {
    users: usersReducer,
    hobbies: hobbiesReducer,
  },
});

export default store;
