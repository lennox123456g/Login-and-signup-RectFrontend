import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // This points to your combined reducers

const store = configureStore({
  
  reducer: rootReducer,//reducer: rootReducer,  // Use rootReducer directly, not wrapped in another object
  // add other reducers here as needed
  
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // optional if you want to customize
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; // Add this line!
