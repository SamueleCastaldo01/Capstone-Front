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
  const token = localStorage.getItem('authToken');
  const [open, setOpen] = React.useState(false);
  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Opzioni per titoli
      ['bold', 'italic', 'underline'], 
      [{ color: [] }, { background: [] }], 
      ['link', 'image'], 
      [{ align: [] }], 
      ['clean'], 
    ],
  };

  const handleSave = async () => {
    if (!token) {
      alert('Token non trovato');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/argomento/103', {
        method: 'PUT', // Metodo PUT per aggiornare
        headers: {
          'Content-Type': 'application/json', // Tipo di contenuto JSON
          'Authorization': `Bearer ${token}`, // Bearer Token per l'autenticazione
        },
        body: JSON.stringify({
          titolo: 'Introduzione alla programmazione', // Titolo (puoi modificarlo come necessario)
          contenuto: value, // Contenuto che viene scritto nell'editor
          id_corso: 52, // ID del corso
        }),
      });

      // Gestione della risposta
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

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='px-4 px-lg-0 divPrincipale'>
          <h1 className='titlePage'>Flash Card</h1>
          <div className='mt-4 d-flex flex-column gap-3 justify-content-start'>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ width: '80%', height: '50px', marginBottom: '20px' }}
          >
            Salva Contenuto
          </Button>

          </div>

        </div>

      </motion.div>
    </>
  )

}

export default Homepage 
