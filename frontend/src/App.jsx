import React from 'react'

import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FileClaim from './pages/FileClaim';
import DocumentsPage from "./pages/DocumentsPage";
import HelpSupport from "./pages/HelpSupport";
import Analytics from './pages/Analytics';
import AdminLayout from './pages/AdminLayout';
import Clients from './pages/Clients';
import Agents from './pages/Agents';
import Claims from './pages/Claims';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import CustomerLayout from './pages/CustomerLayout';


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
        <Route path="/" element={<Home/>}/>
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/" element={<CustomerLayout />}>
          <Route path="customer" element={<CustomerDashboard />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>
        
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* <Route path="/admin/analytics" element={<Analytics />} /> */}
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route path="analytics" element={<Analytics />} /> 
        </Route> */}
        <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />   {/* ✅ DEFAULT PAGE */}
  <Route path="analytics" element={<Analytics />} />
   <Route path="clients" element={<Clients />} />
   <Route path="agents" element={<Agents />} />
   <Route path="claims" element={<Claims />} />
   <Route path="settings" element={<Settings />} />
</Route>
        <Route path="/file-claim" element={<FileClaim />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </>
  )
}

export default App
