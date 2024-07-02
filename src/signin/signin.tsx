// Login.tsx

import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './signin.css';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/'); // Redirect to the home page
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className='login-body'>
      <div className="login-container">
        <div className="login-card">
          <div className='title'>
              <h1>Login to</h1>
              <h1 className='easynote'>Easynote</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Create Account</Link> {/* Add this line */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;