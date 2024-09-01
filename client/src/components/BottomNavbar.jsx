import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaUserCircle, FaHome } from 'react-icons/fa';
import { LuListTodo } from "react-icons/lu";
import { TbRobotFace } from "react-icons/tb";
import '../css/BottomNavbar.css';

function BottomNavbar() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuth] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userid', data._id);
                setUser(data);
                setAuth(true);
            } else {
                // Handle unauthorized or other errors
                const data = await response.json();
                console.error(data.msg);
                setAuth(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    fetchProfile();
  }, []);
  return (
    <nav className="bottom-navbar">
    <Link to={isAuthenticated ? "/list" : "/login"}><LuListTodo /></Link>
    <Link to={isAuthenticated ? "/ai" : "/login"}><TbRobotFace /></Link>
    <Link to="/"><FaHome /></Link>
    <Link to={isAuthenticated ? "/data" : "/login"}><FaChartBar /></Link>
    <Link to={isAuthenticated ? "/profile" : "/login"}><FaUserCircle /></Link>
    </nav>
    )
}

export default BottomNavbar;
