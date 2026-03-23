import React from 'react'

import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
// import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/auth' element= {<Auth/>}/>
      </Routes>
    </>
  )
}

export default App
