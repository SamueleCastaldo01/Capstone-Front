import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili predefiniti
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

function Homepage() {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const [argomento, setArgomento] = useState(null);

  const token = localStorage.getItem('authToken');
  const argomentoId = 103;


  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();




  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/argomento/103', {
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

      if (response.ok) {
        const data = await response.json();
        console.log('Dati salvati:', data);
        alert('Contenuto salvato con successo!');
      } else {
        throw new Error('Errore nel salvataggio');
      }
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message); // Mostra l'errore
      alert('Errore nel salvataggio del contenuto');
    }
  };

    // Funzione per la GET request
    const fetchArgomento = async (id) => {  
      try {
        const response = await fetch(`http://localhost:3001/argomento/${id}`, {
          method: 'GET', // Metodo GET per recuperare
          headers: {
            'Authorization': `Bearer ${token}`, // Bearer Token per l'autenticazione
            'Content-Type': 'application/json', // Tipo di contenuto JSON
          },
        });
  
        // Gestione della risposta
        if (response.ok) {
          const data = await response.json();
          setArgomento(data); // Imposta i dati nell'argomento
          setValue(data.contenuto); // Imposta il contenuto nel value per l'editor
          setLoading(false); // Imposta lo stato di loading a false
        } else {
          throw new Error('Errore nel recupero dei dati');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); // Mostra l'errore
        setLoading(false); // Imposta lo stato di loading a false
      }
    };

    useEffect(() => {
      fetchArgomento(argomentoId); // Passa l'ID dell'argomento
    }, [argomentoId]);

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>

        <div style={{height: "70vh"}} className='px-4 px-lg-0 text-center d-flex flex-column justify-content-center'>

            <div className='addAppunti' onClick={() => {navigate("/addcorso")}}>
              <h2>Aggiungi Appunti</h2>
              <div style={{paddingTop: "120px"}}>
                <h2 style={{fontSize: "100px"}}>+</h2>
              </div>
            </div>

        </div>

      </motion.div>
    </>
  )

}

export default Homepage 
