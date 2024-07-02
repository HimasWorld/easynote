// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import Home from './home/home';
import Login from './signin/signin';
import Signup from './signup/signup';
import './App.css';
import Notebook from './notebook/notebook';
import { NotebookProvider } from './contexts/notebookContext';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Home /> : <Signup />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotebookProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<AppContent />} />
            <Route path="/notebook/:id" element={<Notebook />} />
          </Routes>
        </Router>
      </NotebookProvider>
    </AuthProvider>
  );
};

export default App;
