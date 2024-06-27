import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../auth/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { format } from 'date-fns';

export interface NotebookData {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  color: string;
  tintColor: string;
}

const Home: React.FC = () => {
  const [notebooks, setNotebooks] = useState<NotebookData[]>([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    async function fetchNotebooks() {
      if (!auth.currentUser) return;

      const notebooksCollection = collection(db, 'notebooks');
      const notebooksQuery = query(notebooksCollection, where('uid', '==', auth.currentUser.uid));
      const notebookSnapshot = await getDocs(notebooksQuery);

      const notebookList = notebookSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        createdAt: doc.data().createdAt,
        color: doc.data().color,
        tintColor: doc.data().tintColor
      }));

      setNotebooks(notebookList.sort((a, b) => b.createdAt - a.createdAt));
    };

    fetchNotebooks();
  }, []);

  const pastelColors = [
    '#fde0c6', '#fbc9c3', '#fdd0d6', '#e8c3db',
    '#bae4f3', '#c1e5d9', '#d3eada', '#f5f3d9'
  ];  
  
  const tintColors = [
    '#7d684f', '#7d594e', '#7e5a62', '#715967',
    '#4b6c78', '#4eb5a3', '#5d6d5a', '#77746e'
  ];

  function getRandomPastelColor() {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  }

  const handleAddNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDate = Timestamp.fromDate(new Date());
    const randomPastelColor = getRandomPastelColor();
    const randomTintColor = tintColors[pastelColors.indexOf(randomPastelColor)];
    
    try {
      const docRef = await addDoc(collection(db, 'notebooks'), {
        title,
        content: '',
        createdAt: newDate,
        uid: auth.currentUser?.uid,
        color: randomPastelColor,
        tintColor: randomTintColor
      });
      
      setNotebooks([
        { id: docRef.id,
          title, 
          content: "",
          createdAt: newDate, 
          color: randomPastelColor,
          tintColor: randomTintColor
        }, ...notebooks
      ]);

      setTitle('');
    } catch (err) {
      console.error("Error adding notebook: ", err);
    }
  };

  const handleLogout = () => {
    // Logout logic
    auth.signOut();
  };

  async function handleDeleteNote(id: string) {
    // Delete logic
    try {
      await deleteDoc(doc(db, 'notebooks', id));
      setNotebooks(notebooks.filter(notebook => notebook.id !== id));
    } catch (err) {
      console.error("Error deleting notebook: ", err);
    }
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
