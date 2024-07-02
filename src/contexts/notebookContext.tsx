import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export interface NotebookData {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  color: string;
  tintColor: string;
}

interface NotebookContextType {
  notebooks: NotebookData[];
  fetchNotebooks: () => void;
  addNote: (title: string) => void;
  handleDeleteNote: (id: string) => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const useNotebooks = () => {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error('useNotebooks must be used within a NotebookProvider');
  }
  return context;
};

export const NotebookProvider = ({ children }: { children: ReactNode }) => {
  const [notebooks, setNotebooks] = useState<NotebookData[]>([]);

  const fetchNotebooks = async () => {
  
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
  }

  const pastelColors = [
    '#fde0c6', '#fbc9c3', '#fdd0d6', '#e8c3db',
    '#bae4f3', '#C1E5D9', '#d3eada', '#f5f3d9'
  ];
  
  const tintColors = [
    '#7d684f', '#7d594e', '#7e5a62', '#715967',
    '#4b6c78', '#4eb5a3', '#5d6d5a', '#77746e'
  ];

  function getRandomPastelColor() {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  }

  const addNote = async (title: string) => {

    if (!auth.currentUser) return;
    
    const newDate = Timestamp.fromDate(new Date());
    const randomPastelColor = getRandomPastelColor();
    const randomTintColor = tintColors[pastelColors.indexOf(randomPastelColor)];  

    try {
      const docRef = await addDoc(collection(db, 'notebooks'), {
        title,
        content: '',
        createdAt: newDate,
        uid: auth.currentUser.uid,
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
      
    } catch (err) {
      console.error("Error adding notebook: ", err);
    }
  };

  async function handleDeleteNote(id: string) {
    try {
      await deleteDoc(doc(db, 'notebooks', id));
      setNotebooks(notebooks.filter(notebook => notebook.id !== id));
    } catch (err) {
      console.error("Error deleting notebook: ", err);
    }
  }

  return (
    <NotebookContext.Provider value={{ notebooks, fetchNotebooks, addNote, handleDeleteNote }}>
      {children}
    </NotebookContext.Provider>
  );
};


