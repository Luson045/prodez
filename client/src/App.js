import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Data from './components/Data';
import List from './components/List';
import AI from './components/AI';
import './App.css';
//import { useMediaQuery } from 'react-responsive';
import BubbleBackground from './components/BackgroundVideo';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { AuthProvider } from './components/AuthContext';


function App() {
  // Define media queries
  return (
    <AuthProvider>
    <div className="App">
      <BubbleBackground/>
      <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/ai" element={<AI />} />
                    <Route path="/data" element={<Data />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
