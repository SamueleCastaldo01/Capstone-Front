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
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from '@mui/icons-material/Close';
import { successNoty, errorNoty } from '../components/Notify';
import QuizIcon from '@mui/icons-material/Quiz';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';

function Corso({fetchArgomentiPerCorso, fetchCorsoPrp}) {

  const [flagCont, setFlagCont] = React.useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true); // Per gestire il loading
  const [loadingArgomento, setLoadingArgomento] = useState(true);
  const [loadingDomande, setLoadingDomande] = useState(true);
  const [error, setError] = useState(null); 
  const [flagDelete, setFlagDelete] = useState(false); 
  const [flagArgomenti, setFlagArgomenti] = useState(true); 
  const [flagDomande, setFlagDomande] = useState(true); 
  const [deleteNomeCorso, setDeleteNomeCorso] = useState(""); 
  const [nomeCorso, setNomeCorso] = useState(null); 
  const API = process.env.REACT_APP_BACKEND;


  const [titoloArgomento, setTitoloArgomento] = useState(""); 

  const [domanda, setDomanda] = useState(""); 
  const [domandaCorretta, setDomandaCorretta] = useState(""); 
  const [idArgomentoSelected, setIdArgomentoSelected] = useState(""); 
  
  const [selectFilter, setSelectFilter] = React.useState(0);

  const [coloreCopertina, setColoreCopertina] = useState('');
  const [open, setOpen] = React.useState(false);
  const [corso, setCorso] = useState([]);
  const [argomenti, setArgomenti] = useState([]);
  const [domande, setDomande] = useState([]);
  const { id } = useParams();

  const token = localStorage.getItem('authToken');



  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();

  const handleChangeFilter = (event) => {
    setSelectFilter(event.target.value);
    fetchDomandePerCorso(id, event.target.value)
  };

  //Get--------------------------------------------------------------
    // Funzione per la GET request
    const fetchCorso = async (id) => {  
      try {
        const response = await fetch(API + `/corso/${id}`, {
          method: 'GET', // Metodo GET per recuperare
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });

        const data = await response.json();
  
        // Gestione della risposta
        if (response.ok) {
          setCorso(data);
          setNomeCorso(data.nomeCorso)
          setColoreCopertina(data.coloreCopertina)
          setLoading(false); 
          fetchArgomentiPerCorsoMe(id);
          fetchArgomentiPerCorso(id);
          fetchDomandePerCorso(id, 0);
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

    const fetchArgomentiPerCorsoMe = async (idCorso) => {
      setLoadingArgomento(true)
        try {
          const response = await fetch(API + `/argomento/corso/${idCorso}`, {
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setArgomenti(data);
          setLoadingArgomento(false)
        } catch (err) {
            
        }
      };

    const fetchDomandePerCorso = async (idCorso, select) => {
      setLoadingDomande(true);
      let str= "";
      if(select == 0) {
        str = "corso/" + idCorso
      } else {
        str = "argomento/" + select
        console.log(select)
      }
      try {
        const response = await fetch(API + "/domanda/" +str, {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setDomande(data);
        console.log("dovrebbe funzionare")
        setLoadingDomande(false);
      } catch (err) {
          
      }
    };

    useEffect(() => {
        fetchCorso(id);
    }, [id]);


    //------------------------------------------------------------------------------------------
    const handleSave = async () => {
      try {
        const response = await fetch(API + '/corso/' + id, {
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

        const data = await response.json();
  
        if (response.ok) {
          
          successNoty("Materia aggiornata :)")
          fetchCorsoPrp();
        } else {
          errorNoty(data.message)
          throw new Error('Errore nel salvataggio');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message); // Mostra l'errore

      }
    };

        //------------------------------------------------------------------------------------------
      const handleSaveArgomento = async () => {
        try {
          const response = await fetch(API + '/argomento', {
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

          const data = await response.json();
    
          if (response.ok) {
            successNoty("Argomento creato :)")
            fetchArgomentiPerCorsoMe(id)
            fetchArgomentiPerCorso(id);
            setTitoloArgomento("");
          } else {
            errorNoty(data.message);
            throw new Error('Errore nel salvataggio');
          }
        } catch (err) {
          console.error('Errore:', err);
          setError(err.message); // Mostra l'errore
        }
      };

      //------------------------------------------------------------------------------------------
      const handleSaveDomanda = async () => {
        try {
          const response = await fetch(API + '/domanda', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
              domanda: domanda, 
              id_argomento: idArgomentoSelected, 
              rispostaDomanda: domandaCorretta,

            }),
          });

          const data = await response.json();
    
          if (response.ok) {
            successNoty("Domanda Creata :)")
            setDomanda("");
            setDomandaCorretta("");
            fetchDomandePerCorso(id, 0)
          } else {
            errorNoty(data.message);
            throw new Error('Errore nel salvataggio');
          }
        } catch (err) {
          console.error('Errore:', err);
          setError(err.message); // Mostra l'errore
        }
      };

      //delete--------------------------------------------------------------
      const deleteCorso = async (id) => {  
        try {
          const response = await fetch(API + `/corso/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', 
            },
          });
    
          // Gestione della risposta
          if (response.ok) {
              successNoty("Corso Eliminato")
              fetchCorsoPrp()
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

  //-----------------------------------------------------------------------
      const handleDeleteDomanda = async (idDomanda) => {  
        try {
          const response = await fetch(API + `/domanda/${idDomanda}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', 
            },
          });
    
          // Gestione della risposta
          if (response.ok) {
              successNoty("Domanda Eliminata")
              fetchDomandePerCorso(id, selectFilter)
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

            <div className='mt-5 d-flex justify-content-between'>
              <Button onClick={() => {navigate("/flashcard/0/" + id)}} style={{width: 150, height: "60px"}} variant="contained" startIcon={<PsychologyAltIcon/>}>FlashCard</Button>
            </div>
            
               {/***I miei argomenti ++++++++++++++++++++++++++++++++++++++++++++++++++ */}
              <div>
                 <div className='mt-5 d-flex align-items-center gap-2 pt-2' style={{borderTop: "3px solid #771AA9"}}>
                  <h3 className='mb-0'>I miei argomenti</h3>
                    <IconButton onClick= {() => {setFlagArgomenti(!flagArgomenti)}}>
                      {flagArgomenti ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                    </IconButton>
                 </div>
                  <Collapse in={flagArgomenti} timeout="auto" unmountOnExit>
                    <div className='mt-3 ps-3'>
                      <div className=''>
                        {argomenti.map((argomento) => {
                          return (
                            <>
                            <div className='d-flex gap-2 align-items-center mb-3'>
                              <div className='d-flex align-items-center selctedDiv' key={argomento.id}>
                                <IconButton className='p-0'><BookmarkIcon style={{color: "black"}}/></IconButton>
                                <h5 onClick={() => {navigate("/argomento/" + argomento.id)}} className='mb-0 fakeLink'>{argomento.titolo}</h5>
                              </div>
                              <div className='selctedDiv'>
                                <IconButton className='p-0' onClick={() => {navigate("/flashcard/" + argomento.id + "/0")}}><PsychologyAltIcon style={{color: "black"}}/></IconButton>
                              </div>
                            
                            </div>
                            </>
                          )
                        })
                        }
                       {loadingArgomento &&  <CircularProgress /> }
                      </div>
                      <div className='pt-3' >
                        <div>
                          <h6>Aggiungi un Argomento per questa Materia</h6>
                        </div>
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
                  </Collapse>  
               </div>

                {/***Le mie domande ++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                <div>
                  <div className='d-flex align-items-center justify-content-between mt-5  pt-2' style={{borderTop: "3px solid #771AA9"}}>
                    <div className='d-flex align-items-center'>
                      <h3 className='mb-0'>Le mie Domande</h3>
                      <IconButton onClick= {() => {setFlagDomande(!flagDomande)}}>
                        {flagDomande ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                      </IconButton>
                    </div>
               
                    <div className="w-25">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Filtro Domande</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectFilter}
                          label="Filtro Domande"
                          onChange={handleChangeFilter}
                        >
                          <MenuItem value={0}>Questo Corso</MenuItem>
                          {argomenti.map((argomento) => {
                            return(
                              <MenuItem key={argomento.id} value={argomento.id}>{argomento.titolo}</MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  
                  <div className='mt-3 ps-3'>
                    <Collapse in={flagDomande} timeout="auto" unmountOnExit>
                      {domande.map((domanda) => {
                          return (
                            <div className=' mb-3' key={domanda.id}>
                              <div className='d-flex gap-2'>
                                <div className='d-flex align-items-center selctedDiv'>
                                  <IconButton className='p-0'><QuizIcon style={{color: "black"}}/></IconButton>
                                  <h5  className='mb-0 '>{domanda.domanda}</h5>
                                </div>
                                <div className='selctedDiv'>
                                  <IconButton className='p-0' onClick={() => {handleDeleteDomanda(domanda.id)}}><DeleteIcon style={{color: "red"}}/></IconButton>
                                </div>
                              </div>
                          
                              <p className='mb-0 ps-3'><b style={{color: "#008f39"}}>Risposta corretta:</b> {domanda.rispostaDomanda}</p>
                            </div>
                          )
                        })
                      }
                    
                    {loadingDomande &&  <CircularProgress /> }
                      <h6 className='mt-4'>Aggiungi una Domanda per questa Materia</h6>
                      <div className='d-flex flex-column ps-1 gap-4'>
                      <TextField 
                          value={domanda}
                          onChange={(event) => setDomanda(event.target.value)}
                          label="Aggiungi una Domanda"
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
                        <Button onClick={() => {handleSaveDomanda()}} variant="contained">Aggiungi</Button>
                      </div>
                
                    </div>
                    </Collapse>
                  </div>
                </div>


                {/***Delete ++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                <div className='mt-5 text-center pb-2'>
                  {flagDelete &&
                  <div className='pt-2' style={{borderTop: "3px solid red"}}>
                      <div className='d-flex justify-content-between'>
                        <h3 className='text-start'>Elimina <span style={{color: "red"}}>{nomeCorso}</span></h3>
                        <IconButton onClick={() => {setFlagDelete(false)}}>
                          <CloseIcon style={{color: "red"}}/>
                        </IconButton>
                      </div>
                      
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
