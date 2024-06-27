import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Add missing import for Timestamp
import { db } from '../auth/firebaseConfig';
import './notebook.css';
import { NotebookData } from '../home/home';

const Notebook: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the notebook id from the URL
  const [notebook, setNotbook] = useState<NotebookData>(); // State to store the content of a new note
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchNote = async () => {
      if (!id) return;

      const note = doc(db, 'notebooks', id);
      const noteSnapshot = await getDoc(note);

      if (!noteSnapshot.exists()) {
        console.error("Note not found");
        setIsLoading(false);
        return;
      }

      const noteData = noteSnapshot.data();
      setInput(noteData.content);
      setNotbook(noteData as NotebookData);
      setIsLoading(false);
    };

    fetchNote();
  }, [id]);

  async function updatenNoteInFirestore(newContent: string) {

    try {
      if (!id) return; // if there is no id, return

      const note = doc(db, 'notebooks', id);  // get the note document
      await setDoc(note, { content: newContent }, { merge: true }); // merge: true will only update the content field
    } catch (err) {
      console.error("Error adding note: ", err);
    } finally {
      setIsLoading(false); // always happends; stop the loading animation
    }
  }
  
  useEffect(() => {
    // a console log about that we are saving resources by not calling Firestore on every key stroke
    console.log("check changed, wait 1 second before updating Firestore...");
    if (input === notebook?.content) {
      return;
    } 

    setIsLoading(true);
    const getData = setTimeout(() => {
      console.log("updating Firestore...");
      updatenNoteInFirestore(input);
    }, 1000)

    return () => clearTimeout(getData)
  }, [input, notebook?.content])

  return (
    <div className="notebook-container">
      <div className='title-loader'>
        {!isLoading && <h1>{notebook?.title ?? "Notes"}</h1>}
        {isLoading && <div className='loading-animation'>
          <p>Saving...</p>
        </div> }
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What's on your mind?"
      />
    </div>
  );
};

export default Notebook;
