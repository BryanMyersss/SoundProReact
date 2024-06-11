import React, { useEffect } from 'react'
import { Shop, LoginRegister } from './pages';
import { CreateProduct } from './pages/admin';

import { useDispatch } from 'react-redux';
import { AppDispatch } from './state/store'
import { fetchUser } from './state/user/user.slice'
import { needToFetchUser } from './api/auth.api';

import { Route, Routes } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  // User functionality
  useEffect(() => {
    if (needToFetchUser()) {
      dispatch(fetchUser())
    }
  }, [dispatch])

  return (
    < Routes >
      < Route path="/" element={< Shop />} />
      < Route path="/admin" element={< CreateProduct />} />
      < Route path="/user/login" element={< LoginRegister />} />
      < Route path="/user/register" element={< LoginRegister isLoginDefault={false}/>} />
    </ Routes >
  )
}

export default App