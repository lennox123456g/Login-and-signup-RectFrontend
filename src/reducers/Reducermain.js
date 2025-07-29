// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth'; // No need to use .js extension

const rootReducer = combineReducers({
  auth,
  // other reducers can go here
});

export default rootReducer;

//import { useSelector } from 'react-redux';
//const { isAuthenticated, loading, user, error, message } = useSelector(state => state.auth);
