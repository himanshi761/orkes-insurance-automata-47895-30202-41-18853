import React from 'react'

import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FileClaim from './pages/FileClaim';
// import Login from "./pages/Login";
// CustomerDashboard
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        {/* <Route path='/login' element= {<Login/>}/> */}
        <Route path='/auth' element= {<Auth/>}/>
        {/* <Route path='/auth' element= {<Claim/>}/> */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/file-claim" element={<FileClaim />} />
        
      </Routes>
    </>
  )
}

export default App
