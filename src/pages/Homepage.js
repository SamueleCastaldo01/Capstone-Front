import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili predefiniti
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { successNoty, errorNoty } from '../components/Notify';
import { motion } from 'framer-motion';

function Homepage() {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const [argomento, setArgomento] = useState(null);
  const API = process.env.REACT_APP_BACKEND;


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
          errorNoty(data.message);
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

        <div style={{height: "70vh"}} className='px-4 px-lg-0 text-center d-flex align-items-center justify-content-lg-start gap-4'>

            <div className='addAppunti' onClick={() => {navigate("/addcorso")}}>
              <h2>Crea una Materia</h2>
              <div style={{paddingTop: "120px"}}>
                <h2 style={{fontSize: "100px"}}>+</h2>
              </div>
            </div>
            <div className='homeMaterie' onClick={() => {navigate("/imieiappunti")}}>
              <h2>I miei appunti</h2>
              <div style={{paddingTop: "250px"}}>
              </div>
            </div>
            <div className='homeMaterie' onClick={() => {navigate("/flashcard")}}>
              <h2>FlashCard</h2>
              <div style={{paddingTop: "250px"}}>
              </div>
            </div>

        </div>

      </motion.div>
    </>
  )

}

export default Homepage 
