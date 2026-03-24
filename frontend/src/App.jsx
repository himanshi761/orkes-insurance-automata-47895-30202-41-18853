import React from 'react'

import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import CustomerDashboard from './pages/CustomerDashboard';
// import Login from "./pages/Login";
// CustomerDashboard
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/auth' element= {<Auth/>}/>
        {/* <Route path='/auth' element= {<Claim/>}/> */}
        <Route path="/customer" element={<CustomerDashboard />} />
        
      </Routes>
    </>
  )
}

export default App
