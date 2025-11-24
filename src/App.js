import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminView from './components/Admin/AdminView';
import TeamOwnerView from './components/TeamOwnerView';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminView />} />
          <Route path="/owner/*" element={<TeamOwnerView />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
