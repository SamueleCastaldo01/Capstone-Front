import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, Collapse, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { notifyErrorAddCliente, notifyErrorAddUsername, successAddCliente } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import { errorNoty, successNoty} from "../components/Notify";

export function AddFatture() {
    const navigate = useNavigate();
    const [statiFattura, setStatiFattura] = useState([]);
    const [isLoadingStatoFattura, setIsLoadingStatoFattura] = useState(true);
    const [statoCliente, setStatoCliente] = useState(false);
    const [dataClienti, setdataClienti] = useState([]);
    const [statoClienteRicerca, setStatoClienteRicerca] = useState(false);
    const [isLoadingRicercaCliente, setIsLoadingRicercaCliente] = useState(true);
    const [ricercaCliente, setRicercaCliente] = useState('');
    const [nomeContatto, setNomeContatto] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [data, setData] = useState('');
    const [importo, setImporto] = useState('');
    const [numero, setNumero] = useState('');
    const [idStatoFattura, setIdStatoFattura] = useState('');
    const [showOptionalFields, setShowOptionalFields] = useState(false);
    const token = localStorage.getItem('authToken');


    const fetchRicercaCliente = async (nomeCliente) => {
        setIsLoadingRicercaCliente(true);
        setStatoClienteRicerca(false);
        setNomeContatto("");
        if(nomeCliente) {
            try {
                const response = await fetch('http://localhost:3001/clienti/filtered?nomeContatto=' + nomeCliente, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
                  }
                });
            
                if (!response.ok) {
                    const error = await response.json();
                    errorNoty(
                    error.message || "Errore durante il caricamento dei clienti."
                  );
                  throw new Error(`Error: ${response.status} ${response.statusText}`);

                }
                const data = await response.json();
                if (data.content && data.content.length > 0) {
                    setdataClienti(data.content);
                    setStatoClienteRicerca(true); 
                    setIsLoadingRicercaCliente(false);
                } else {
                    setdataClienti([]); 
                    setStatoClienteRicerca(false);
                    errorNoty("Clienti non trovati")
                }
                           
                setStatoCliente(false);
              } catch (error) {
                console.error("Error fetching invoice data:", error);
                errorNoty("Errore")
              }
              
        } else {
            errorNoty("Clienti non trovati");
        }
       
    }

    const fetchStatiFattura = async () => {
        try {
            const response = await fetch('http://localhost:3001/stato-fatture', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
              }
            });
        
            if (!response.ok) {
                const error = await response.json();
                errorNoty(
                error.message || "Errore durante il caricamento dei clienti."
              );
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setStatiFattura(data);
            setIsLoadingStatoFattura(false);
          } catch (error) {
            console.error("Error fetching invoice data:", error);
            errorNoty("Errore")
          }
    }

    useEffect(() => {
        fetchStatiFattura();
    },[])

    
    const handleChangeAutocomplete = (event, newValue) => {
        if (newValue) {
            setIdStatoFattura(newValue.id); 
        } else {
            setIdStatoFattura(null); 
        }
      };

    const handleChangeAutocompleteCliente = (event, newValue) => {
    if (newValue) {
        setIdCliente(newValue.id);
        setNomeContatto(newValue.nomeContatto);
    } else {
        setIdCliente(null); 
        setNomeContatto("");
    }
    };

    const handleConferma = () => {
        if(nomeContatto) {
            setStatoCliente(true);
         } 
        }
    

    const handleReset = () => {
        setIdCliente("");
        setData("");
        setImporto("");
        setNumero("");
        setIdStatoFattura("");
    };


    const notifyErrorAddFattura = (message) => {
        alert(message);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        

        const fatturaData = {
            id_cliente: idCliente,
            data: data,
            importo: importo,
            numero: numero,
            id_stato_fattura: idStatoFattura,
        };

        try {
            const response = await fetch('http://localhost:3001/fatture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(fatturaData),
            });

            if (response.ok) {
                const data = await response.json();
                handleReset();
                navigate('/listafatture');
                successNoty("Fattura creata correttamente");
            } else {
                const error = await response.json();
                errorNoty(
                    error.message || "Errore durante il caricamento delle Fatture."
                  );

            }
        } catch (error) {
            errorNoty('Errore di rete. Riprova più tardi.');
        }

    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className='container-fluid' style={{marginBottom : "400px"}}>
                <h2 className='titlePage'>Aggiungi una Fattura</h2>

             
                <form className='d-flex mt-4'>
                    <TextField style={{width: "300px"}} required label="Cerca Cliente" variant="outlined" color='tertiary' value={ricercaCliente} onChange={(e) => setRicercaCliente(e.target.value)} />
                    <Button  onClick={() => {fetchRicercaCliente(ricercaCliente)}} variant="contained">Cerca Cliente</Button>
                </form>

                    {statoClienteRicerca &&
                    <div className='d-flex mt-5'>
                        <Autocomplete
                        disablePortal
                        freeSolo={false}
                        options={dataClienti}
                        getOptionLabel={(option) => option.nomeContatto} // Visualizza nomeStato nell'elenco
                        sx={{ width: 300 }}
                        onChange={handleChangeAutocompleteCliente} // Gestisci selezione
                        renderInput={(params) => <TextField {...params} label="Seleziona Cliente" />}
                        />
                    
                    <Button  onClick={() => {handleConferma()}} variant="contained">Conferma</Button>
                    </div>
                    }
               
                {statoCliente && 
                <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        <TextField className='w-100' required label="Cliente" variant="outlined" color='tertiary' value={nomeContatto} disabled={true} />
                    </div>

                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        <TextField className='w-100' required type="date" label="Data" variant="outlined" color='tertiary' value={data} onChange={(e) => setData(e.target.value)} InputLabelProps={{ shrink: true }} />
                    </div>

                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        <TextField className='w-100' required type="number" label="Importo" variant="outlined" color='tertiary' value={importo} onChange={(e) => setImporto(e.target.value)} />
                    </div>

                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        <TextField className='w-100' required type="number" label="Numero Fattura" variant="outlined" color='tertiary' value={numero} onChange={(e) => setNumero(e.target.value)} />
                    </div>

                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        {isLoadingStatoFattura ? 
                        <CircularProgress />
                        :
                        <Autocomplete
                        disablePortal
                        options={statiFattura}
                        getOptionLabel={(option) => option.nomeStato} // Visualizza nomeStato nell'elenco
                        sx={{ width: 300 }}
                        onChange={handleChangeAutocomplete} // Gestisci selezione
                        renderInput={(params) => <TextField {...params} label="Stato Fattura" />}
                        />
                        }
                  
                    </div>
                </div>
                <Button className='mt-4' type="submit" variant="contained">Aggiungi Fattura</Button>
            </form>
                 }

                 <div className='mt-5'>
                    <Button className='mt-4' onClick={() => {navigate("/aggiungistatofattura")}} variant="contained">Aggiungi Stato fattura</Button>
                 </div>

     
            </div>
        </motion.div>
    );
}
