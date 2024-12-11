import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { errorNoty, successNoty} from "../components/Notify";
import Avatar from '@mui/material/Avatar';

export function MyAccount() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [inpIMage, setInpImage] = useState("");

    const API = process.env.REACT_APP_BACKEND;
    const token = localStorage.getItem('authToken');


    const srcImg = localStorage.getItem("profilePic")

    const fetchAnagraficaUtente = async () => {  
        try {
          const response = await fetch(API + `/utente/me`, {
            method: 'GET', // Metodo GET per recuperare
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', 
            },
          });
  
          const data = await response.json();
    
          // Gestione della risposta
          if (response.ok) {
            setUsername(data.username)
            setNome(data.nome)
            setCognome(data.cognome);
            setEmail(data.email);
          } else {
            errorNoty(data.message);
            throw new Error('Errore nel recupero dei dati');
          }
        } catch (err) {
          console.error('Errore:', err);
        }
      };

      useEffect(() => {
        fetchAnagraficaUtente();
      },[])


      const handleEditAnagrafica = async () => {
        try {
          const response = await fetch(API + '/utente/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
              nome: nome, 
              cognome: cognome,
              email: email,
            }),
          });
  
          const data = await response.json();
    
          if (response.ok) {
            successNoty("Anagrafica aggiornata :)")
            fetchAnagraficaUtente();
          } else {
            errorNoty(data.message)
            throw new Error('Errore nel salvataggio');
          }
        } catch (err) {
          console.error('Errore:', err);
  
        }
      };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className='divPrincipale'>
                <h2 className='titlePage'>Il mio Account</h2>

            <div className='mt-5 row'>
                <div className='col-3 d-flex justify-content-end'>
                 <Avatar alt="Remy Sharp" src={srcImg}  sx={{ width: 250, height: 250 }}/>
                </div>
             
       
                <div className='col-8'>
                    <h6>Dati Anagrafici</h6>
                    <div className='d-flex gap-4'>
                        <TextField 
                                value={username}
                                disabled="true"
                                onChange={(event) => setUsername(event.target.value)}
                                label="Username"
                                style={{ width: "80%" }}
                                InputProps={{ style: { fontSize: "20px" } }} 
                                InputLabelProps={{ style: { fontSize: "20px" } }} 
                        />
                        <TextField 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            label="Email"
                            style={{ width: "80%" }}
                            InputProps={{ style: { fontSize: "20px" } }} 
                            InputLabelProps={{ style: { fontSize: "20px" } }} 
                    />
                    </div>
             
                    <div className='d-flex gap-4 mt-3'>
                        <TextField 
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                label="Nome"
                                style={{ width: "80%" }}
                                InputProps={{ style: { fontSize: "20px" } }} 
                                InputLabelProps={{ style: { fontSize: "20px" } }} 
                        />
                   
                            <TextField 
                                value={cognome}
                                onChange={(event) => setCognome(event.target.value)}
                                label="Cognome"
                                style={{ width: "80%" }}
                                InputProps={{ style: { fontSize: "20px" } }} 
                                InputLabelProps={{ style: { fontSize: "20px" } }} 
                        />
                    </div>
                    <Button variant='contained' className='mt-3' onClick={() => {handleEditAnagrafica()}}>Salva</Button>

                    <div className='mt-5'>
                        <h6>Cambia Immagine Profilo</h6>
                        <TextField 
                                value={inpIMage}
                                onChange={(event) => setInpImage(event.target.value)}
                                type='file'
                                style={{ width: "80%" }}
                                InputProps={{ style: { fontSize: "20px" } }} 
                                InputLabelProps={{ style: { fontSize: "20px" } }} 
                        />
                    </div>
                    <Button variant='contained' className='mt-3'>Cambia Immagine</Button>
               
               
                </div>
      
    
            </div>

            </div>
          
          
    
        </motion.div>
    );
}
