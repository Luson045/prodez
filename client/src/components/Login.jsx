import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notify = (msg,type) => {
    if (type==="success"){
    toast.success(msg, {                       
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    }else{
        toast.warning(msg, {                       
            position: "bottom-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`https://prodez-ai.onrender.com/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
        notify("Login Successful","success")
        localStorage.setItem('token', data.token);
        setLoading(false);
        navigate('/profile');
    } else {
        notify(data.msg,"error");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <p className="redirect">Dont have an account?<a href="/register">Sign up</a></p>
        </label>
        <button type="submit" className="login-button">{isloading?"Loading":"Login"}</button>
      </form>
    </div>
  );
};

export default Login;
