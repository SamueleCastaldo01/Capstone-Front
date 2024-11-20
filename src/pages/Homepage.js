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
