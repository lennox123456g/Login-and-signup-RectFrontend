import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux'; // ✅ use hooks instead of connect
import { checkAuthenticated, load_user } from '../actions/auth';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuthenticated());
    dispatch(load_user());
  }, [dispatch]);

  return (
    <div class="w-full">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <main>{children}</main>
    </div>
  );
};


export default Layout;
