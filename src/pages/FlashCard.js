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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
  const { idArgomento } = useParams();
  const { idCorsoParm } = useParams();

  const token = localStorage.getItem('authToken');


  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();


  const fetchDomande = async () => {
    setLoadingDomande(true)
    let str = ""
    if(idArgomento != 0) {
      str = "argomento/"  +idArgomento
    } else if(idCorsoParm != 0) {
      str = "corso/" + idCorsoParm
    } else {
      navigate("/")
    }
    try {
      const response = await fetch("http://localhost:3001/domanda/" + str , {
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

    const fetchCorso = async () => {  
      try {
        const response = await fetch(`http://localhost:3001/corso/${idCorsoParm}`, {
          method: 'GET', // Metodo GET per recuperare
          headers: {
            'Authorization': `Bearer ${token}`, // Bearer Token per l'autenticazione
            'Content-Type': 'application/json', // Tipo di contenuto JSON
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setNomeCorso(data.nomeCorso);
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
      fetchDomande();
      if(idArgomento != 0) {
        fetchArgomento(idArgomento); 
      } 
      if(idCorsoParm != 0) {
        fetchCorso();
      }
      
    }, [idArgomento, idCorsoParm]);

    useEffect(() => {
      if (domande.length > 0) {
        setCurrentQuestion(domande[currentIndex]);
        controlloFlash(currentIndex)
      } else {
        setCurrentQuestion(null)
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
      fetchEditDomanda(difficolta)  //aggiorna la domanda
      setFlagVedi(false)

      controlloFlash(currentIndex + 1)
    
  };

  const controlloFlash = (tentativo) => {
    let flagCiclo = false
        //qui devo fare un ulteriore controllo e vedere questa domanda può essere visualizzata, altrimenti passa alla prossima
        //fin quando non trova una disponibile, quindi cmq devo fare una sorta di ciclo, un do while
        while(!flagCiclo) {
          if (tentativo <= domande.length - 1) { //prima di tutto deve fare il controllo che non sia superato l'array
          const dataModificaDifficolta = domande[tentativo].dataModificaDifficolta;
          const ritardoMinuti = domande[tentativo].ritardo; 
          const ritardoMillisecondi = ritardoMinuti * 60 * 1000;
          const dataModificaMillisecondi = new Date(dataModificaDifficolta).getTime();
          const nuovaDataTimestamp  = dataModificaMillisecondi + ritardoMillisecondi;
          const dataAttuale = Date.now(); 
          if(dataAttuale > nuovaDataTimestamp) {  //in questo caso vuol dire che lo posso visualizzare
            flagCiclo = true;
          } else {   //altrimenti deve passare al successivo attraverso il ciclo
            tentativo = tentativo + 1
          }
        } else {
          flagCiclo = true;
          tentativo = tentativo
          setCurrentQuestion(null)
        }
        }
    setCurrentIndex(tentativo)

  }

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='px-4 pt-3 px-lg-0 divPrincipale'>
          <div className='d-flex gap-1 align-items-center'>
            <IconButton onClick={() => {navigate("/flashcard")}}>
              <ArrowBackIosIcon style={{color: "black"}} />
            </IconButton>
            <h1 onClick={() => {navigate("/flashcard")}} className='mb-0 cursor-pointer'>FlashCard</h1>
          </div>

            <div className='mt-5 d-flex flex-column align-items-center justify-content-center'>
              {idCorsoParm == 0 ?
              <h2 className='fakeLink' onClick={() => {navigate("/corso/" + idCorso)}}>{nomeCorso}</h2>
              :
              <h2 className='fakeLink' onClick={() => {navigate("/corso/" + idCorsoParm)}}>{nomeCorso}</h2>
              }
               
               <h4 className='fakeLink' onClick={() => {navigate("/argomento/" + idArgomento)}}>{titoloArgomento}</h4>


               {loadingDomande ? (
                  <CircularProgress />
                ) : currentQuestion ? (
                  <div className='divBigFla '>
                    <h5 className='text-center'>FlashCard: <b>{currentIndex + 1}/{domande.length}</b></h5>
                    <div key={currentQuestion.id} className='divFlash d-flex flex-column justify-content-center text-center position-relative' onClick={() => {setFlagVedi(!flagVedi)}}>
                      { !flagVedi ?
                      <>
                        <h4 className=' position-absolute top-0' style={{color: "#D32F2F"}}>Domanda</h4>
                        <h3>{currentQuestion.domanda}</h3>
                      </>
                      :
                      <>
                        <h4 className=' position-absolute top-0' style={{color: "#008f39"}}>Risposta</h4>
                        <h3>{currentQuestion.rispostaDomanda}</h3>
                      </>
                      }
              
                    </div>
                  </div>
              
                ) : (
                  <div className='mt-5 text-center'>
                     <h5>Non ci sono domande disponibili.</h5>
                     <h5>Riprova più tardi, nell'attesa studia altro oppure rilassati</h5>
                     <Button variant="contained" onClick={() => {fetchDomande(); setCurrentIndex(0)}}>Ricarica</Button>
                  </div>
                 
                )}
                  {flagVedi &&
                    <div className='mt-5 divButtonFlash d-flex justify-content-between'>
                    <Button className='buttonFlash' style={{backgroundColor: "#8300E9"}} variant="contained" onClick={() => {nextQuestion("ripeti")}}>Ripeti<br/>1 minuto</Button>
                    <Button className='buttonFlash' style={{backgroundColor: "#6E22ED"}} variant="contained" onClick={() => {nextQuestion("difficile")}}>Difficile<br/> 5 minuti</Button>
                    <Button className='buttonFlash' style={{backgroundColor: "#5A44F1"}} variant="contained" onClick={() => {nextQuestion("normale")}}>Normale<br/> 15 minuti</Button>
                    <Button className='buttonFlash' style={{backgroundColor: "#3B76F7"}} variant="contained" onClick={() => {nextQuestion("facile")}}>Facile<br/> 1 ora</Button>
                    </div>
                  }   
              
                       
              
            </div>
       

        </div>

      </motion.div>
    </>
  )

}

export default FlashCard 
