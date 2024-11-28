import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { errorNoty, successNoty } from '../components/Notify';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

function FlashCard() {

  const [flagCont, setFlagCont] = React.useState(false);

  const [value, setValue] = useState('');
  const [idCorso, setIdCorso] = useState('');
  const [titoloArgomento, setTitoloArgomento] = useState(''); 
  const [nomeCorso, setNomeCorso] = useState(''); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [domande, setDomande] = useState([]);
  const [loadingDomande, setLoadingDomande] = useState(true);
  const [flagVedi, setFlagVedi] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState([])

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


  const fetchDomandePerCorso = async () => {
    setLoadingDomande(true)
    try {
      const response = await fetch("http://localhost:3001/domanda/argomento/" + id , {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setDomande(data);
      setLoadingDomande(false)
    } catch (err) {
        
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
      fetchDomandePerCorso();
      fetchArgomento(id); 
    }, [id]);

    useEffect(() => {
      if (domande.length > 0) {
        setCurrentQuestion(domande[currentIndex]);
      }
    }, [domande, currentIndex]);


    //Edit Domanda----------------------------------------------------
    const fetchEditDomanda = async (difficolta) => {
      try {
        const response = await fetch('http://localhost:3001/domanda/' + currentQuestion.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify({
            domanda: currentQuestion.domanda, 
            id_argomento: currentQuestion.argomento.id,
            rispostaDomanda: currentQuestion.rispostaDomanda,
            difficolta: difficolta
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
        } else {
          errorNoty("Errore durante il salvataggio")
          throw new Error('Errore nel salvataggio');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); // Mostra l'errore

      }
    };

    const nextQuestion = (difficolta) => {
      fetchEditDomanda(difficolta)
      setFlagVedi(false)
      if (currentIndex < domande.length - 1) {
          setCurrentIndex(currentIndex + 1);
      }
  };

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='px-4 pt-3 px-lg-0 divPrincipale'>
            <div className='d-flex flex-column align-items-center justify-content-center'>
               <h1>{nomeCorso}</h1>
               <h3>{titoloArgomento}</h3>


               {loadingDomande ? (
                  <CircularProgress />
                ) : currentQuestion ? (
                  <div className='divBigFla '>
                    <h5 className='text-center'>FlashCard: <b>{currentIndex + 1}/</b></h5>
                    <div key={currentQuestion.id} className='divFlash d-flex flex-column justify-content-center text-center' onClick={() => {setFlagVedi(!flagVedi)}}>
                      { !flagVedi ?
                        <h3>{currentQuestion.domanda}</h3>
                      :
                      <>
                        <h2>Risposta</h2>
                        <h3>{currentQuestion.rispostaDomanda}</h3>
                      </>
                      }
              
                    </div>
                  </div>
              
                ) : (
                  <p>Non ci sono domande disponibili.</p>
                )}
                     
                  <div className='mt-5 divButtonFlash d-flex justify-content-between'>
                  <Button className='buttonFlash' style={{backgroundColor: "#8300E9"}} variant="contained" onClick={() => {nextQuestion("ripeti")}}>Ripeti</Button>
                  <Button className='buttonFlash' style={{backgroundColor: "#6E22ED"}} variant="contained" onClick={() => {nextQuestion("difficile")}}>Difficile</Button>
                  <Button className='buttonFlash' style={{backgroundColor: "#5A44F1"}} variant="contained" onClick={() => {nextQuestion("normale")}}>Normale</Button>
                  <Button className='buttonFlash' style={{backgroundColor: "#3B76F7"}} variant="contained" onClick={() => {nextQuestion("facile")}}>Facile</Button>
                  </div>
                       
              
            </div>
       

        </div>

      </motion.div>
    </>
  )

}

export default FlashCard 
