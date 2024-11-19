import { styled, ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { itIT } from "@mui/x-data-grid/locales";
import CircularProgress from '@mui/material/CircularProgress';
import { Paper, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShareIcon from "@mui/icons-material/Share";
import RefreshIcon from '@mui/icons-material/Refresh';
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { EditCliente } from '../components/EditCliente';
import { errorNoty, successNoty} from "../components/Notify";

export function FattureList() {
  const [fatture, setFatture] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [searchPhone, setSearchPhone] = useState(''); // Stato per il numero di telefono da cercare
  const [searchNome, setSearchNome] = useState('');  
  const [searchStato, setSearchStato] = useState('');  
  const [searchMinData, setSearchMinData] = useState('');  
  const [searchMaxData, setSearchMaxData] = useState('');  
  const [searchAnno, setSearchAnno] = useState('');  
  const [searchMinImporto, setSearchMinImporto] = useState('');  
  const [searchMaxImporto, setSearchMaxImporto] = useState('');  
  const [searchCognome, setSearchCognome] = useState(''); 
  const [searchType, setSearhType] = useState('nome'); 

  const token = localStorage.getItem("authToken");

  const handleEdit = (customerId) => {
    setEditCustomerId(customerId);
    setEditOpen(true);
  };

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  const fetchSearch = async () => {
    let search = "";
    if(searchType == "nome") {
        search = "cliente/nomecontatto/" + searchNome;
    }
    if(searchType == "stato") {
      search = "stato-fattura/nomestato/" + searchStato;
    }
    if(searchType == "data") {
      search = "range?startDate=" + searchMinData + "&endDate=" + searchMaxData
    }
    if(searchType == "anno") {
      search = "anno?anno=" + searchAnno
    }
    if(searchType == "importi") {
      search = "importo-range?importoMin=" + searchMinImporto + "&importoMax=" + searchMaxImporto
    }
    try {
      const response = await fetch('http://localhost:3001/fatture/' + search, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
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
  
      const transformedInvoices = data.content.map((item) => ({
        id: item.id, 
        numero: item.numero,
        importo: item.importo,
        data: item.data,
        clienteId: item.cliente.id,
        nomeContatto: item.cliente.nomeContatto,
        cognomeContatto: item.cliente.cognomeContatto,
        nomeStato: item.statoFattura.nomeStato,
      }));
      setInvoices(transformedInvoices); 

    } catch (error) {
      errorNoty("Error fetching customer data:", error);
    }
  }

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:3001/fatture', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const transformedInvoices = data.content.map((item) => ({
        id: item.id, 
        numero: item.numero,
        importo: item.importo,
        data: item.data,
        clienteId: item.cliente.id,
        nomeContatto: item.cliente.nomeContatto,
        cognomeContatto: item.cliente.cognomeContatto,
        nomeStato: item.statoFattura.nomeStato,
      }));
  
      setInvoices(transformedInvoices);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };
  

  useEffect(() => {
    fetchInvoices();
  }, []);
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const fetchDelete = async (idFattura) => {
    console.log(idFattura);
    try {
      const response = await fetch('http://localhost:3001/fatture/' + idFattura, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        errorNoty(
          error.message || "Errore durante il caricamento delle fatture."
        );
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      } 
  
      successNoty("Fattura eliminata correttamente");
      fetchInvoices();
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

    //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------

  const capitalizeWords = (str) => {
    return str
      .toLowerCase() // Converte l'intera stringa in minuscolo
      .split(' ') // Divide la stringa in parole
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizza la prima lettera di ogni parola
      .join(' '); // Riunisce le parole in una stringa
  };



  const handleRowSelectionChange = (newSelection) => {
    console.log("Selected Customer IDs:", newSelection);
    setSelectedCustomerIds(newSelection);
  };


  const handleConfirmDelete = () => {
    setConfirmOpen(true);
  };


  const handleSearchNome = (e) => {
    e.preventDefault();

  };



  const handleResetSearch = () => {
    setSearchCognome("");
    setSearchNome("");
    setSearchPhone("");
  }
 
  const columns = [
    { field: "id", headerName: "Id Fattura", width: 130 },
    { field: "numero", headerName: "Numero Fattura", width: 130 },
    { field: "importo", headerName: "Importo (€)", width: 130 },
    { field: "data", headerName: "Data", width: 130 },
    { field: "clienteId", headerName: "ID Cliente", width: 100 },
    { field: "nomeContatto", headerName: "Nome Contatto", width: 150 },
    { field: "cognomeContatto", headerName: "Cognome Contatto", width: 150 },
    { field: "nomeStato", headerName: "Stato Fattura", width: 150 },
];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="container-fluid">
        <h2 className='titlePage'>Lista Fatture</h2>
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <div className='d-flex flex-column  gap-2'>
            <div className='d-flex align-items-center gap-2'>
              <p className='mb-0'><strong>Ricerca per:</strong></p>
              <p className={`pSearch ${searchType === "nome" ? "active" : ""}`}  onClick={() => {setSearhType("nome")}}>Nome</p> 
              <p className={`pSearch ${searchType === "stato" ? "active" : ""}`}  onClick={() => {setSearhType("stato")}}>Stato</p> 
              <p className={`pSearch ${searchType === "data" ? "active" : ""}`}  onClick={() => {setSearhType("data")}}>Data</p> 
              <p className={`pSearch ${searchType === "anno" ? "active" : ""}`}  onClick={() => {setSearhType("anno")}}>Anno</p> 
              <p className={`pSearch ${searchType === "importi" ? "active" : ""}`}  onClick={() => {setSearhType("importi")}}>Importi</p> 
            </div>
          {searchType == "nome" &&
          <div className="d-flex align-items-center">
            <TextField
              style={{width: "180px"}}
              label="Cerca per Nome"
              variant="outlined"
              className="me-2"
              value={searchNome}
              onChange={(e) => {
                const formattedName = capitalizeWords(e.target.value); // Capitalizza il valore inserito
                setSearchNome(formattedName); // Aggiorna lo stato con il valore formattato
              }}  // Aggiorna lo stato con il valore inserito
            />
            <Button
              className="me-2"
              onClick={() => {fetchSearch()}}
              color="primary"
              variant="contained">Cerca</Button>
          </div>
          }
          {searchType == "stato" &&
          <div className="d-flex align-items-center">
            <TextField
              style={{width: "180px"}}
              label="Cerca per Stato"
              variant="outlined"
              className="me-2"
              value={searchStato}
              onChange={(e) => setSearchStato(e.target.value)}
            />
            <Button
              className="me-2"
              onClick={() => {fetchSearch()}}
              color="primary"
              variant="contained"
            >
              Cerca
            </Button>
          </div>
          }
           {searchType == "data" &&
            <div className="d-flex gap-3 align-items-center">

              <TextField  type='date' label="Data Min" 
              variant="outlined" color='tertiary'
              value={searchMinData} 
              onChange={(e) => setSearchMinData(e.target.value)}
                InputLabelProps={{ shrink: true }} 
                />
              <TextField  type='date' label="Data Max" 
              variant="outlined" color='tertiary'
              value={searchMaxData} 
              onChange={(e) => setSearchMaxData(e.target.value)}
                InputLabelProps={{ shrink: true }} 
                />
              <Button
                className="me-2"
                onClick={() => {fetchSearch()}}
                color="primary"
                variant="contained"
              >
                Cerca
              </Button>
            </div>
            }
          {searchType == "anno" &&
          <div className="d-flex align-items-center">
            <TextField
              style={{width: "180px"}}
              label="Cerca per Anno"
              variant="outlined"
              type='number'
              className="me-2"
              value={searchAnno}
              onChange={(e) => setSearchAnno(e.target.value)}
            />
            <Button
              className="me-2"
              onClick={() => {fetchSearch()}}
              color="primary"
              variant="contained">Cerca</Button>
          </div>
          }
          {searchType == "importi" &&
          <div className="d-flex align-items-center">
            <TextField
              style={{width: "180px"}}
              label="Importo Minimo"
              variant="outlined"
              type='number'
              className="me-2"
              value={searchMinImporto}
              onChange={(e) => setSearchMinImporto(e.target.value)}
            />
            <TextField
              style={{width: "180px"}}
              label="importo Massimo"
              variant="outlined"
              type='number'
              className="me-2"
              value={searchMaxImporto}
              onChange={(e) => setSearchMaxImporto(e.target.value)}
            />
            <Button
              className="me-2"
              onClick={() => {fetchSearch()}}
              color="primary"
              variant="contained">Cerca</Button>
          </div>
          }
          </div>
          <div>
            <IconButton variant="contained" onClick={() => {fetchInvoices(""); handleResetSearch()}}>
              <RefreshIcon/>
            </IconButton>
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => navigate("/aggiungifatture")}
            >
              Aggiungi fattura
            </Button>
            { /*
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => handleEdit(selectedCustomerIds[0])}
              disabled={selectedCustomerIds.length !== 1}
            >
              Modifica
            </Button>
            */}
            <Button color='error' variant="contained" onClick={() => fetchDelete(selectedCustomerIds[0])} disabled={selectedCustomerIds.length !== 1}>
              Elimina 
            </Button>
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <Paper className='mt-4' sx={{ height: 500, borderRadius: '8px', overflowX: "auto", position: "relative" }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </div>
            ) : (
              <StyledDataGrid
                onCellClick={() => {}}
                rows={invoices}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleRowSelectionChange}
                localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
              />
            )}
          </Paper>
        </ThemeProvider>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Cliente eliminato!" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle style={{backgroundColor: "#1E1E1E" }}>Conferma Eliminazione</DialogTitle>
          <DialogContent style={{backgroundColor: "#1E1E1E" }}>
            <DialogContentText>
              Sei sicuro di voler eliminare {selectedCustomerIds.length} cliente{i => (selectedCustomerIds.length > 1 ? 'i' : '')} selezionato{i => (selectedCustomerIds.length > 1 ? 'i' : '')}?
            </DialogContentText>
          </DialogContent >
          <DialogActions style={{backgroundColor: "#1E1E1E" }}>
            <Button onClick={() => setConfirmOpen(false)} color="primary">Annulla</Button>
            <Button onClick={""} color="error">Elimina</Button>
          </DialogActions>
        </Dialog>

        <Dialog maxWidth="md" open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle style={{backgroundColor: "#1E1E1E" }}>Modifica Cliente</DialogTitle>
        </Dialog>
      </div>
    </motion.div>
  );
}
