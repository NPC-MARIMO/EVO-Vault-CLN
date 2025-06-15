import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import familyReducer from './familySlice'
import requestReducer from './requestSlice'
import memoryReducer from './memorySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    family : familyReducer,
    request : requestReducer,
    memory : memoryReducer
  },
});
