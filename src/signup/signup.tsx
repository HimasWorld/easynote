// Signup.tsx

import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className='signup-body'>
      <div className="signup-container">
        <div className="signup-card">
          <div className='title'>
              <h1>Welcome to</h1>
              <h1 className='easynote'>Easynote</h1>
          </div>
          <form onSubmit={handleSignup}>
            <div className="signup-input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="signup-input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-button">Sign Up</button>
            {error && <p className="signup-error-message">{error}</p>}
          </form>
          <p className="signup-link">
            Alrady have an account? <Link to="/login">Login</Link> {/* Add this line */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
