import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { errorNoty, successNoty} from "../components/Notify";
import Autocomplete from '@mui/material/Autocomplete';

export function AddIndirizzi() {
  const navigate = useNavigate();

  const [via, setVia] = useState("");
  const [flagIndirizzo, setFlagIdirizzo] = useState(false);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataComune, setDataComune] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [civico, setCivico] = useState("");
  const [localita, setLocalita] = useState("");
  const [cap, setCap] = useState("");
  const [comune, setComune] = useState("");

  const token = localStorage.getItem("authToken");

  const handleReset = () => {
    setVia("");
    setCivico("");
    setLocalita("");
    setCap("");
    setComune("");
  };

  const handleConferma = () => {
    if(provincia) {
      setFlagIdirizzo(true);
      fetchComuniByProvincia(provincia);
    } else {
      setFlagIdirizzo(false);
    }
  }    

  const handleChangeAutocomplete = (event, newValue) => {
    if (newValue) {
      setProvincia(newValue.provincia); 
    } else {
      setProvincia(null); 
    }
  };

  const handleChangeAutocompleteComune = (event, newValue) => {
    if (newValue) {
      setComune(newValue.comune); 
    } else {
      setComune(null); 
    }
  };


  const fetchProvince = async () => {
    try {
      const response = await fetch('http://localhost:3001/province', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        errorNoty(
          error.message || "Errore durante il caricamento delle province."
        );
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setDataProvince(data);
      successNoty("province caricate correttamente.")

    } catch (error) {
      console.error("Error fetching invoice data:", error);
      errorNoty("Errore")
    }
  }

  useEffect(() => {
    fetchProvince();
  },[])


  const fetchComuniByProvincia = async (nomeProvincia) => {
    try {
      const response = await fetch('http://localhost:3001/comune/provincia?nomeProvincia=' + nomeProvincia, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        }
      });
  
      if (!response.ok) {
        
        const error = await response.json();
        errorNoty(
          error.message || "Errore durante il caricamento dei comuni."
        );
      } 
      const data = await response.json();
      setDataComune(data);
      successNoty("Dati dei comuni caricati correttamente");
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      errorNoty("error")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clienteData = {
      via,
      civico,
      localita,
      cap,
      comune: comune,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("authToken");
      // Effettua la richiesta fetch all'API
      const response = await fetch("http://localhost:3001/indirizzi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clienteData),
      });

      if (response.ok) {
        successNoty("Indirizzo aggiungo correttamente");
        handleReset();
        navigate("/addcustomer");
      } else {
        const error = await response.json();
        errorNoty(
          error.message || "Errore durante l'aggiunta del cliente."
        );
      }
    } catch (error) {
      errorNoty("Errore di rete. Riprova più tardi.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container-fluid">
        <h2 className="titlePage">Aggiungi un nuovo indirizzo</h2>

        <div className='d-flex mt-5'>
          <Autocomplete
          disablePortal
          freeSolo={false}
          options={dataProvince}
          getOptionLabel={(option) => option.provincia} // Visualizza nomeStato nell'elenco
          sx={{ width: 300 }}
          onChange={handleChangeAutocomplete} // Gestisci selezione
          renderInput={(params) => <TextField {...params} label="inserisci una Provincia" />}
          />
      
          <Button  onClick={() => {handleConferma()}} variant="contained">Conferma</Button>
          </div>

        {flagIndirizzo &&
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Via"
                variant="outlined"
                color="tertiary"
                value={via}
                onChange={(e) => {
                  
                  setVia(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                type="number"
                required
                label="Civico"
                variant="outlined"
                color="tertiary"
                value={civico}
                onChange={(e) => setCivico(e.target.value)}
              />
            </div>
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Localitá"
                variant="outlined"
                color="tertiary"
                value={localita}
                onChange={(e) => {
                  setLocalita(e.target.value)
                }}
              />
            </div>

            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                type="number"
                required
                label="Cap"
                variant="outlined"
                color="tertiary"
                value={cap}
                onChange={(e) =>
                  setCap(e.target.value)
                }
              />
            </div>

            <div className="d-flex mt-4 col-lg-4 col-md-6 col-sm-12">
            <Autocomplete
              disablePortal
              freeSolo={false}
              options={dataComune}
              getOptionLabel={(option) => option.comune} // Visualizza nomeStato nell'elenco
              sx={{ width: 300 }}
              onChange={handleChangeAutocompleteComune} // Gestisci selezione
              renderInput={(params) => <TextField {...params} label="inserisci una Provincia" />}
            />
          </div>
          </div>
          <Button className="mt-4" type="submit" variant="contained">
            Aggiungi Indirizzo
          </Button>
        </form>
        }
      </div>
    </motion.div>
  );
}
