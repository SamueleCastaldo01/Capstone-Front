import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili predefiniti
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { successNoty, errorNoty } from '../components/Notify';

function AddCorso() {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [nomeCorso, setNomeCorso] = useState('');
  const [coloreCopertina, setColoreCopertina] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 

  const token = localStorage.getItem('authToken');


  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();



  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/corso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          nomeCorso: nomeCorso, 
          coloreCopertina: coloreCopertina, 
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
    }
  };


  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='px-4 px-lg-0 text-center divPrincipale'>
            <h1 className='mb-4'>Crea una Materia</h1>
                <TextField
                id="outlined-basic"
                label="Titolo della Materia"
                variant="outlined"
                value={nomeCorso}
                onChange={(event) => setNomeCorso(event.target.value)}
                sx={{
                    width: '50%',        
                    fontSize: '2.5rem',     
                    '& .MuiInputBase-root': {
                    fontSize: '2.5rem',    
                    },
                    '& .MuiInputLabel-root': {
                    fontSize: '2.2rem',   
                    },
                }}
                />
            <div className='mt-4'>
            <TextField
                id="outlined-basic"
                label="Colore copertina"
                type="color"
                variant="outlined"
                value={coloreCopertina}
                onChange={(event) => setColoreCopertina(event.target.value)}
                sx={{
                    '& .MuiInputBase-root': {
                    padding: '0', 
                    },
                    '& input[type="color"]': {
                    width: '100px',  
                    height: '40px', 
                    borderRadius: '50%', 
                    border: 'none', 
                    outline: 'none', 
                    },
                    '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    },
                }}
            />
            </div>

            <Button onClick={() => {handleSave()}} className='mt-5 p-3' variant="contained">Crea una Materia</Button>
         
        </div>

      </motion.div>
    </>
  )

}

export default AddCorso 
