import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { errorNoty, successNoty } from '../components/Notify';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';

function Argomento() {

  const [flagCont, setFlagCont] = React.useState(false);

  const [value, setValue] = useState('');
  const [idCorso, setIdCorso] = useState('');
  const [titoloArgomento, setTitoloArgomento] = useState(''); 
  const [nomeCorso, setNomeCorso] = useState(''); 

  //eliminazione
  const [flagDelete, setFlagDelete] = useState(false); 
  const [deleteTitoloCroso, setDeleteTitoloCorso] = useState(""); 

  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const [argomento, setArgomento] = useState(null);
  const { id } = useParams();

  const token = localStorage.getItem('authToken');


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
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }], // Header
      [{ 'size': ['small', false, 'large', 'huge'] }], // Dimensioni del testo
      ['bold', 'italic', 'underline', 'strike'], // Formattazioni del testo
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Liste numerate e puntate
      [{ 'align': [] }], // Allineamento
      [{ 'color': [] }, { 'background': [] }], // Colore del testo e dello sfondo
      ['link', 'image', 'video'], // Link, immagini, video
      ['blockquote'], // Citazioni in blocco
      ['code-block'], // Blocchi di codice
      ['clean'], // Pulisce la formattazione
    ],
    clipboard: {
      matchVisual: false, // Gestisce la copia/incolla
    },
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/argomento/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          titolo: titoloArgomento, 
          contenuto: value, 
          id_corso: idCorso, 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        successNoty("Dati salvati :)")
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
  
        if (response.ok) {
          const data = await response.json();
          setArgomento(data); 
          setValue(data.contenuto); 
          setTitoloArgomento(data.titolo);
          setNomeCorso(data.corso.nomeCorso);
          setIdCorso(data.corso.id);
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
      fetchArgomento(id); 
    }, [id]);


    
//delete--------------------------------------------
const deleteArgomento = async (id) => {  
  try {
    const response = await fetch(`http://localhost:3001/argomento/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
      },
    });
    if (response.ok) {
        successNoty("Argomento Eliminato")
        navigate("/")
    } else {
      throw new Error('Errore nel recupero dei dati');
    }
  } catch (err) {
    console.error('Errore:', err);
    setError(err.message); 
    setLoading(false);
  }
};


const handleDelete = () => {
  if(!flagDelete) {
    setFlagDelete(true);
  } else {
    if(deleteTitoloCroso == titoloArgomento) {
      deleteArgomento(id)
    } else {
      errorNoty("Hai sbagliato a scrivere il nome del corso")
    }
    
  }
}

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='px-4 pt-3 px-lg-0 divPrincipale'>
            <h6 onClick={() => {navigate("/corso/" + idCorso)}} className='mb-0 fakeLink'>{nomeCorso}</h6>
            <div className='d-flex align-items-center justify-content-between'>
                <input style={{border: "none", fontSize: "40px", fontWeight:"bolder", width: "70%"}} value={titoloArgomento} onChange={(event) => setTitoloArgomento(event.target.value)} />
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Salva
                </Button>
            </div>
       
          <div className='mt-1 d-flex flex-column gap-3 justify-content-start'>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            className="quill-editor" 
          />
          </div>

          <div className='mt-5 text-center'>
                  {flagDelete &&
                  <div>
                        <h3 className='text-start'>Elimina <span style={{color: "red"}}>{titoloArgomento}</span></h3>
                        <p className='text-start'><b>Attenzione:</b> Perderai tutti i dati associati a questo <b>Argomento</b></p>
                        <TextField 
                            value={deleteTitoloCroso}
                            onChange={(event) => setDeleteTitoloCorso(event.target.value)}
                            label="Aggingi il nome di questo corso per eliminarlo"
                            style={{ width: "100%" }}
                            InputProps={{ style: { fontSize: "20px" } }} 
                            InputLabelProps={{ style: { fontSize: "20px" } }} 
                          />
                  </div>
                  }
          
                   <Button className='w-100' onClick={() => {handleDelete()}} style={{height: "50px"}} color='error' variant='contained'>Elimina Argomento</Button>
                </div>

                <div style={{height: "50px"}}></div>
            

        </div>

      </motion.div>
    </>
  )

}

export default Argomento 
