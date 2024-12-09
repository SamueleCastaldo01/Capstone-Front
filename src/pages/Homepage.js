import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili predefiniti
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { successNoty, errorNoty } from '../components/Notify';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import { motion } from 'framer-motion';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

function Homepage() {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const [argomento, setArgomento] = useState(null);
  const API = process.env.REACT_APP_BACKEND;
  const scrollContainerRef = useRef(null); 

    // Funzioni per il drag-to-scroll
    const handleMouseDown = (e) => {
      const container = scrollContainerRef.current;
      container.isDown = true;
      container.startX = e.pageX - container.offsetLeft;
      container.scrollLeftStart = container.scrollLeft;
    };
  
    const handleMouseUp = () => {
      const container = scrollContainerRef.current;
      container.isDown = false;
    };
  
    const handleMouseMove = (e) => {
      const container = scrollContainerRef.current;
      if (!container.isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - container.startX) * 1.3;
      container.scrollLeft = container.scrollLeftStart - walk;
    };


  const token = localStorage.getItem('authToken');
  const argomentoId = 103;


  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();




  const handleSave = async () => {
    try {
      const response = await fetch(API + '/argomento/103', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          titolo: 'Introduzione alla programmazione', 
          contenuto: value, 
          id_corso: 52, 
        }),
      });

      const data = await response.json();

      if (response.ok) { 
        console.log('Dati salvati:', data);
        alert('Contenuto salvato con successo!');
      } else {
        errorNoty(data.message);
        throw new Error('Errore nel salvataggio');
      }
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message); // Mostra l'errore
      alert('Errore nel salvataggio del contenuto');
    }
  };

 
    const fetchArgomento = async (id) => {  
      try {
        const response = await fetch(API + `/argomento/${id}`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });

        const data = await response.json();
  
      
        if (response.ok) {
          
          setArgomento(data); 
          setValue(data.contenuto); 
          setLoading(false);
        } else {
          throw new Error('Errore nel recupero dei dati');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); 
        setLoading(false); 
      }
    };

    useEffect(() => {
      fetchArgomento(argomentoId); 
    }, [argomentoId]);

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>

        <div className='user-select'>
          <img src='logo.jpg' style={{width: "180px"}} className='position-absolute'/>
        </div>

        <div
            ref={scrollContainerRef}
            className="scroll-container px-4 px-lg-0 text-center d-flex align-items-center gap-4"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className='addAppunti position-relative' onDoubleClick={() => {navigate("/addcorso")}}>
              <div className='pt-3'>
                <h2>Crea una Materia</h2>
                <BookmarkAddIcon style={{fontSize: "150px"}} className="iconCenterHome"/>
              </div>
            </div>

            <div className='homeMaterie position-relative' onDoubleClick={() => {navigate("/imieiappunti")}}>
              <div className='pt-3'>
              <h2>I miei appunti</h2>
              <LibraryBooksIcon style={{fontSize: "150px"}} className="iconCenterHome"/>
              </div>
            </div>

            <div className='homeMaterie position-relative' onDoubleClick={() => {navigate("/flashcard")}}>
              <div className=' bg-white text-black rounded-3 pt-3' style={{height: "100%"}}>
                <h2>FlashCard</h2>
                <PsychologyAltIcon style={{fontSize: "150px"}} className="iconCenterHome"/>
              </div>
            </div>

        </div>


      </motion.div>
    </>
  )

}

export default Homepage 
