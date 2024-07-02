import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { format } from 'date-fns';
import { handleLogout } from '../contexts/authContext';
import { useNotebooks } from '../contexts/notebookContext';

const Home: React.FC = () => {
  const { notebooks, fetchNotebooks, addNote, handleDeleteNote } = useNotebooks();

  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  function handleAddNotebook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Adding notebook');
    addNote(title);
    setTitle('');
  }

  return (
    <div>
      <div className="home-container">
        <h1>Your Notebooks</h1>
        <form onSubmit={handleAddNotebook} className="add-notebook-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Notebook Title"
          />
          <button type="submit">Add Notebook</button>
        </form>
        <div className="notebook-list">
          {notebooks.map((notebook) => (
            <div style={{ backgroundColor: notebook.color }} key={notebook.id} className="notebook-item" onClick={() => navigate(`/notebook/${notebook.id}`)}>
              <h2 style={{ color: notebook.tintColor }}>{notebook.title}</h2>

              <div className='media'>
                <p className='date'>{format(notebook.createdAt.toDate(), 'MMMM dd, yyyy')}</p>
                <button onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(notebook.id)
                  }}
                >x</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Home;
