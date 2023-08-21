
import Login from './system/Login';
import Layout from './system/Layout';
import Home from './system/Home';
import Error from './system/Error'
import RequireAuth from './system/RequireAuth';
import PersistLogin from './system/PersistLogin';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (


    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;
