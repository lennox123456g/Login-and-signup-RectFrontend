import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Newsletter from './containers/Newsletter';
import Translate from './containers/Translate.jsx';
//import Facebook from './containers/Facebook';
//import Google from './containers/Google';

import { Provider } from 'react-redux';
import store from './store';


import Layout from './hocs/Layout';

const App = () => (
    <Provider store={store}>
        <Router>
            <div className="flex flex-col min-h-screen w-full">
                <Layout>
                    <main className="flex-grow w-full mt-10">
                        <Routes>
                            <Route path='/' element={<Home />}  />
                            <Route path='/login' element={<Login />}  />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/reset-password' element={<ResetPassword />} />
                            <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
                            <Route path='/activate/:uid/:token' element={<Activate />} />
                            <Route path='/newsletter' element={<Newsletter />} />
                            <Route path='/translate' element={<Translate/>} />
                        </Routes>
                    </main>
                </Layout>
            </div>
        </Router>
    </Provider>
);

export default App;
{/*<Route path='/facebook' element={<Facebook />} />
                    <Route path='/google' element={<Google />} /> */}