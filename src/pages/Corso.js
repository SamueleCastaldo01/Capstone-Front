import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili predefiniti
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IconButton } from '@mui/material';
import { successNoty, errorNoty } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';

function Corso() {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [error, setError] = useState(null); 
  const [flagDelete, setFlagDelete] = useState(false); 
  const [deleteNomeCorso, setDeleteNomeCorso] = useState(""); 
  const [nomeCorso, setNomeCorso] = useState(null); 

  const [titoloArgomento, setTitoloArgomento] = useState(""); 

  const [domanda, setDomanda] = useState(""); 
  const [domandaCorretta, setDomandaCorretta] = useState(""); 
  const [idArgomentoSelected, setIdArgomentoSelected] = useState(""); 
  

  const [coloreCopertina, setColoreCopertina] = useState('');
  const [open, setOpen] = React.useState(false);
  const [corso, setCorso] = useState([]);
  const [argomenti, setArgomenti] = useState([]);
  const { id } = useParams();

  const token = localStorage.getItem('authToken');



  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();

  //Get--------------------------------------------------------------
    // Funzione per la GET request
    const fetchCorso = async (id) => {  
      try {
        const response = await fetch(`http://localhost:3001/corso/${id}`, {
          method: 'GET', // Metodo GET per recuperare
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });
  
        // Gestione della risposta
        if (response.ok) {
          const data = await response.json();
          setCorso(data);
          setNomeCorso(data.nomeCorso)
          setColoreCopertina(data.coloreCopertina)
          setLoading(false); 
          fetchArgomentiPerCorso(id)
        } else {
          throw new Error('Errore nel recupero dei dati');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); 
        setLoading(false);
      }
    };

    const fetchArgomentiPerCorso = async (idCorso) => {
        try {
          const response = await fetch(`http://localhost:3001/argomento/corso/${idCorso}`, {
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setArgomenti(data);
          console.log(argomenti)
        } catch (err) {
            
        }
      };

    useEffect(() => {
        fetchCorso(id);
    }, [id]);


    //------------------------------------------------------------------------------------------
    const handleSave = async () => {
      try {
        const response = await fetch('http://localhost:3001/corso/' + id, {
          method: 'PUT',
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
          successNoty("Materia aggiornata :)")
        } else {
          throw new Error('Errore nel salvataggio');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); // Mostra l'errore
        alert('Errore nel salvataggio del contenuto');
      }
    };

        //------------------------------------------------------------------------------------------
      const handleSaveArgomento = async () => {
        try {
          const response = await fetch('http://localhost:3001/argomento', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
              titolo: titoloArgomento, 
              id_corso: id, 
              contenuto: "<h1>" + titoloArgomento + "</h1>"
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
            successNoty("Argomento creato :)")
            fetchArgomentiPerCorso(id)
          } else {
            throw new Error('Errore nel salvataggio');
          }
        } catch (err) {
          console.error('Errore:', err);
          setError(err.message); // Mostra l'errore
          alert('Errore nel salvataggio del contenuto');
        }
      };

      //delete--------------------------------------------------------------
      const deleteCorso = async (id) => {  
        try {
          const response = await fetch(`http://localhost:3001/corso/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', 
            },
          });
    
          // Gestione della risposta
          if (response.ok) {
              successNoty("Corso Eliminato")
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
          if(deleteNomeCorso == nomeCorso) {
            deleteCorso(id)
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

            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex align-items-center w-100'>
                <TextField
                  id="outlined-basic"
                  type="color"
                  variant="outlined"
                  value={coloreCopertina}
                  onChange={(event) => setColoreCopertina(event.target.value)}
                  sx={{
                      '& .MuiInputBase-root': {
                      padding: '', 
                      },
                      '& input[type="color"]': {
                      width: '20px',  
                      height: '30px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      outline: 'none', 
                      },
                      '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      },
                  }}
                />
                  <input style={{border: "none", fontSize: "40px", fontWeight:"bold", width: "100%"}} value={nomeCorso} onChange={(event) => setNomeCorso(event.target.value)} />
              </div>
                  <Button onClick={() => {handleSave()}} variant="contained">Modifica</Button>
            </div>
            
              <div>
                  <h3 className='mt-5'>I miei argomenti</h3>
                  <div className='mt-3 ps-3'>
                    {argomenti.map((argomento) => {
                      return (
                        <div className='d-flex align-items-center mb-4' key={argomento.id}>
                          <IconButton className='p-0'><BookmarkIcon style={{color: "black"}}/></IconButton>
                          <h5 onClick={() => {navigate("/argomento/" + argomento.id)}} className='mb-0 fakeLink'>{argomento.titolo}</h5>
                        </div>
                      )
                    })
                    }
                    <div className='d-flex align-items-center gap-3 ps-1'>
                    <TextField 
                      value={titoloArgomento}
                      onChange={(event) => setTitoloArgomento(event.target.value)}
                      label="Aggiungi un Argomento"
                      style={{ width: "350px" }}
                      InputProps={{ style: { fontSize: "20px" } }} 
                      InputLabelProps={{ style: { fontSize: "20px" } }}
                    />
                      <Button onClick={() => {handleSaveArgomento()}} variant="contained">Aggiungi</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='mt-5'>Le mie Domande</h3>
                  <div className='mt-3 ps-3'>
                    <div className='d-flex flex-column ps-1 gap-4'>
                      <TextField 
                          value={domanda}
                          onChange={(event) => setDomanda(event.target.value)}
                          label="Aggiungi la Domanda"
                          style={{ width: "80%" }}
                          InputProps={{ style: { fontSize: "20px" } }} 
                          InputLabelProps={{ style: { fontSize: "20px" } }} 
                       />
                      <TextField 
                          value={domandaCorretta}
                          onChange={(event) => setDomandaCorretta(event.target.value)}
                          label="Domanda Corretta"
                          style={{ width: "80%" }}
                          InputProps={{ style: { fontSize: "20px" } }} 
                          InputLabelProps={{ style: { fontSize: "20px" } }} 
                        />
                      <Autocomplete
                        disablePortal
                        options={argomenti}  
                        getOptionLabel={(option) => option.titolo}  
                        isOptionEqualToValue={(option, value) => option.id === value.id} 
                        sx={{ width: "80%" }}
                        renderInput={(params) => <TextField  sx={{
                          width: '100%',
                          height: '50px',
                          input: {
                            height: '30px', 
                            fontSize: '18px', 
                          },
                          label: {
                            fontSize: '18px',
                          }
                        }}  {...params} label="Seleziona Argomento" />}
                        value={argomenti.find(arg => arg.id === idArgomentoSelected) || null} 
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setIdArgomentoSelected(newValue.id);
                          }
                        }}
                      />
                      <div className='mt-3'>
                        <Button onClick={() => {""}} variant="contained">Aggiungi</Button>
                      </div>
                
                    </div>
                  </div>
      
     
                </div>
                
                <div className='mt-5 text-center'>
                  {flagDelete &&
                  <div>
                        <h3 className='text-start'>Elimina <span style={{color: "red"}}>{nomeCorso}</span></h3>
                        <p className='text-start'><b>Attenzione:</b> Perderai tutti i dati associati a questa <b>Materia</b></p>
                        <TextField 
                            value={deleteNomeCorso}
                            onChange={(event) => setDeleteNomeCorso(event.target.value)}
                            label="Aggingi il nome di questo corso per eliminarlo"
                            style={{ width: "100%" }}
                            InputProps={{ style: { fontSize: "20px" } }} 
                            InputLabelProps={{ style: { fontSize: "20px" } }} 
                          />
                  </div>
                  }
          
                   <Button className='w-100' onClick={() => {handleDelete()}} style={{height: "50px"}} color='error' variant='contained'>Elimina Corso</Button>
                </div>
            

            </div>

      </motion.div>
    </>
  )

}

export default Corso 
