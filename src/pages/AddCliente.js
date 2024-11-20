import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { errorNoty, successNoty} from "../components/Notify";
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


export function AddCliente() {
    const navigate = useNavigate();

    const [ragioneSociale, setRagioneSociale] = useState('');
    const [partitaIva, setPartitaIva] = useState('');
    const [dataIndirizzi, setDataIndirizzi] = useState([])
    const [email, setEmail] = useState('');
    const [dataInserimento, setDataInserimento] = useState('');
    const [dataUltimoContatto, setDataUltimoContatto] = useState('');
    const [fatturatoAnnuale, setFatturatoAnnuale] = useState('');
    const [pec, setPec] = useState('');
    const [telefono, setTelefono] = useState('');
    const [emailContatto, setEmailContatto] = useState('');
    const [nomeContatto, setNomeContatto] = useState('');
    const [cognomeContatto, setCognomeContatto] = useState('');
    const [telefonoContatto, setTelefonoContatto] = useState('');
    const [tipoCliente, setTipoCliente] = useState('SAS');
    const [logoAziendale, setLogoAziendale] = useState('');
    const [idSedeLegale, setIdSedeLegale] = useState('');
    const [idSedeOperativa, setIdSedeOperativa] = useState('');

    const token = localStorage.getItem('authToken');


    const fetchIndirizzi = async () => {
        try {
            const response = await fetch('http://localhost:3001/indirizzi', {
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
            setDataIndirizzi(data.content);
            console.log(data.content)
          } catch (error) {
            console.error("Error fetching invoice data:", error);
            errorNoty("Errore")
          }
    }

    useEffect(() => {
        fetchIndirizzi();
    },[])


    const handleReset = () => {
        setRagioneSociale('');
        setPartitaIva('');
        setEmail('');
        setDataInserimento('');
        setDataUltimoContatto('');
        setFatturatoAnnuale('');
        setPec('');
        setTelefono('');
        setEmailContatto('');
        setNomeContatto('');
        setCognomeContatto('');
        setTelefonoContatto('');
        setLogoAziendale('');
        setIdSedeLegale('');
        setIdSedeOperativa('');
    };

    const capitalizeWords = (str) => {
        return str
            .toLowerCase() // Converte l'intera stringa in minuscolo
            .split(' ') // Divide la stringa in parole
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizza la prima lettera di ogni parola
            .join(' '); // Riunisce le parole in una stringa
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const clienteData = {
            ragioneSociale,
            partitaIva,
            email,
            dataInserimento,
            dataUltimoContatto,
            fatturatoAnnuale,
            pec,
            tipoCliente,
            telefono,
            emailContatto,
            nomeContatto,
            cognomeContatto,
            telefonoContatto,
            logoAziendale,
            idSedeLegale,
            idSedeOperativa,
            createdAt: new Date().toISOString(),

        };

        try {
            const token = localStorage.getItem('authToken');
            
            const response = await fetch('http://localhost:3001/clienti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(clienteData),
            });

            if (response.ok) {
                const data = await response.json();
                handleReset(); 
                navigate('/customerlist'); 
                successNoty("Clienti trovati correttamente")
            } else {
                const error = await response.json();
                errorNoty(error.message || 'Errore durante l\'aggiunta del cliente.');
            }
        } catch (error) {
            // Gestione degli errori di rete o altro
            errorNoty('Errore di rete. Riprova più tardi.');
            
        }

    };

    const handleChangeSelect = (event) => {
        setTipoCliente(event.target.value);
      };
    

    const handleChangeAutocompleteSedeLegale = (event, newValue) => {
        if (newValue) {
            setIdSedeLegale(newValue.id);
        } else {
            setIdSedeLegale(null); 
        }
        };
        
    const handleChangeAutocompleteSedeOperativa = (event, newValue) => {
        if (newValue) {
            setIdSedeOperativa(newValue.id);
        } else {
            setIdSedeOperativa(null); 
        }
        };


    //  const handleGeneratePassword = () => {
    //     const length = 10;
    //     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    //     const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     const numberCharset = "0123456789";

    //     let password = "";
    //     password += upperCharset.charAt(Math.floor(Math.random() * upperCharset.length));
    //     password += numberCharset.charAt(Math.floor(Math.random() * numberCharset.length));

    //     for (let i = 2; i < length; i++) {
    //         password += charset.charAt(Math.floor(Math.random() * charset.length));
    //     }

    //     password = password.split('').sort(() => Math.random() - 0.5).join('');
    //     
    //     setPassword(password);
    // };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7}}
        >
            <div className='container-fluid '>
                <h2 className='titlePage'>Aggiungi un nuovo Cliente</h2>

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Nome Contatto" variant="outlined" color='tertiary' value={nomeContatto}
                                onChange={(e) => {
                                    const formattedNome = capitalizeWords(e.target.value);
                                    setNomeContatto(formattedNome);
                                }}
                            />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Cognome Contatto" variant="outlined" color='tertiary' value={cognomeContatto}
                                onChange={(e) => {
                                    const formattedCognome = capitalizeWords(e.target.value);
                                    setCognomeContatto(formattedCognome);
                                }}
                            />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Email" type='email' variant="outlined" color='tertiary' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Pec" type='email' variant="outlined" color='tertiary' value={pec} onChange={(e) => setPec(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number' required label="Numero di Telefono" variant="outlined" color='tertiary' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='date' label="Data di inserimento" variant="outlined" color='tertiary' value={dataInserimento} onChange={(e) => setDataInserimento(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='date' label="Data ultimo contatto" variant="outlined" color='tertiary' value={dataUltimoContatto} onChange={(e) => setDataUltimoContatto(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div className='d-flex mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100'  label="Partita IVA" variant="outlined" color='tertiary' value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <Autocomplete
                            disablePortal
                            freeSolo={false}
                            options={dataIndirizzi}
                            getOptionLabel={(option) => option.via} // Visualizza nomeStato nell'elenco
                            sx={{ width: 300 }}
                            onChange={handleChangeAutocompleteSedeLegale} // Gestisci selezione
                            renderInput={(params) => <TextField {...params} label="Sede Legale" />}
                            />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <Autocomplete
                            disablePortal
                            freeSolo={false}
                            options={dataIndirizzi}
                            getOptionLabel={(option) => option.via} // Visualizza nomeStato nell'elenco
                            sx={{ width: 300 }}
                            onChange={handleChangeAutocompleteSedeOperativa} // Gestisci selezione
                            renderInput={(params) => <TextField {...params} label="Sede Operativa" />}
                            />
                        </div>
                        <FormControl sx={{ m: 1, maxWidth: 200 }} className='mt-4'>
                            <InputLabel id="demo-simple-select-label">Tipo Cliente</InputLabel>
                            <Select
                            defaultValue={"PA"}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tipoCliente}
                            label="Tipo Cliente"
                            onChange={handleChangeSelect}
                            >
                            <MenuItem value={"PA"}>PA</MenuItem>
                            <MenuItem value={"SAS"}>SAS</MenuItem>
                            <MenuItem value={"SPA"}>SPA</MenuItem>
                            <MenuItem value={"SRL"}>SRL</MenuItem>
                            </Select>
                         </FormControl>
                    </div>
                    <h3 className='mt-5'>Campi Facoltativi</h3>
                    <div className='row'>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100'  label="Ragione Sociale" variant="outlined" color='tertiary' value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value.toLowerCase())} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number'  label="Numero di Telefono Contatto" variant="outlined" color='tertiary' value={telefonoContatto} onChange={(e) => setTelefonoContatto(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number'  label="Fattutato Annuale" variant="outlined" color='tertiary' value={fatturatoAnnuale} onChange={(e) => setFatturatoAnnuale(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Email Contatto" variant="outlined" color='tertiary' value={emailContatto} onChange={(e) => setEmailContatto(e.target.value)} />
                        </div>
                        
             
                        
                    </div>
                    <Button className='mt-4' type="submit" variant="contained">Aggiungi Cliente </Button>
                </form>
                <div className='mt-5'>
                <Button className='mt-4' onClick={() =>{
                    navigate("/addindirizzi")
                }} variant="contained">Aggiungi Indirizzo</Button>
                </div>
            
            </div>
        </motion.div>
    );
}
