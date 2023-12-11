import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Home from './container/Home';
import { userInfo } from './utils/general';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo)
    navigate('/login');
  }, [])

  return (
    <Routes>
      <Route path='/login' Component={Login} />
      <Route path='/*' Component={Home} />
    </Routes>
  )
}

export default App;