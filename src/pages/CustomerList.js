import { styled, ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { itIT } from "@mui/x-data-grid/locales";
import CircularProgress from '@mui/material/CircularProgress';
import { Paper, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import { EditCliente } from '../components/EditCliente';
import { errorNoty, successNoty} from "../components/Notify";

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
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
  const [searchMinFatturatoAnnuale, setSearchMinFatturatoAnnuale] = useState('');
  const [searchMAxFatturatoAnnuale, setSearchMaxFatturatoAnnuale] = useState('');
  const [searchDataInserimento, setSearchDataInserimento] = useState('');
  const [searchDataUltimoContatto, setSearchDataUltimoContatto] = useState('');
  const [searchCognome, setSearchCognome] = useState('');
  const [searchType, setSearhType] = useState('nome');

  const token = localStorage.getItem("authToken");

  const handleEdit = (customerId) => {
    setEditCustomerId(customerId);
    setEditOpen(true);
  };

  const fetchSearch = async () => {
    let search = "";
    if(searchType == "nome") {
        search = "nomeContatto=" + searchNome;
    }
    if(searchType == "fatturatoA") {
        search = "minFatturato=" + searchMinFatturatoAnnuale + "&maxFatturato=" +searchMAxFatturatoAnnuale;
    }
    if(searchType == "dataIn") {
      search = "dataInserimento=" + searchDataInserimento;
    }
    if(searchType == "dataUlCo") {
      search = "dataUltimoContatto=" + searchDataUltimoContatto;
    }
    try {
      const response = await fetch('http://localhost:3001/clienti/filtered?' + search, {
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
      setCustomers(data.content); // Imposta i dati dei clienti
    } catch (error) {
      errorNoty("Error fetching customer data:", error);
    }
  }


  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/clienti', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Usa il token per l'autenticazione
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
      setCustomers(data.content); // Imposta i dati dei clienti
    } catch (error) {
      errorNoty("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);



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

  const handleSearch = (e) => {
    e.preventDefault();

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
    { field: "id", headerName: "ID", width: 70 },
    { field: "nomeContatto", headerName: "Nome Contatto", width: 130 },
    { field: "cognomeContatto", headerName: "Cognome Contatto", width: 130 },
    { field: "pec", headerName: "PEC", width: 200 },
    { field: "telefono", headerName: "Telefono", width: 150 },
    { field: "partitaIva", headerName: "Partita IVA", width: 150 },
    { field: "tipoCliente", headerName: "Tipo Cliente", width: 130 },
    { field: "fatturatoAnnuale", headerName: "Fatturato Annuale", width: 130 },
    { field: "dataInserimento", headerName: "Data Inserimento", width: 130 },
    { field: "dataUltimoContatto", headerName: "Data Ultimo Contatto", width: 130 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="container-fluid">
        <h2 className='titlePage'>Anagrafica Clienti</h2>
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <div className='d-flex flex-column  gap-2'>
            <div className='d-flex align-items-center gap-2'>
              <p className='mb-0'><strong>Ricerca per:</strong></p>
              <p className={`pSearch ${searchType === "nome" ? "active" : ""}`} onClick={() => { setSearhType("nome") }}>Nome</p>
              <p className={`pSearch ${searchType === "fatturatoA" ? "active" : ""}`} onClick={() => { setSearhType("fatturatoA") }}>Fatturato Annuale</p>
              <p className={`pSearch ${searchType === "dataIn" ? "active" : ""}`} onClick={() => { setSearhType("dataIn") }}>Data di inserimento</p>
              <p className={`pSearch ${searchType === "dataUlCo" ? "active" : ""}`} onClick={() => { setSearhType("dataUlCo") }}>Data di Ultimo contatto</p>
            </div>
            {searchType == "nome" &&
              <div className="d-flex align-items-center">
                <TextField
                  style={{ width: "180px" }}
                  label="Cerca per Nome"
                  variant="outlined"
                  className="me-2"
                  value={searchNome}
                  onChange={(e) => {
                    const formattedName = capitalizeWords(e.target.value); 
                    setSearchNome(formattedName);
                  }} 
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
            {searchType == "fatturatoA" &&
              <div className="d-flex align-items-center">
                <TextField
                  style={{ width: "180px" }}
                  label="Fatturato Minimo Annuale"
                  variant="outlined"
                  className="me-2"
                  value={searchMinFatturatoAnnuale}
                  onChange={(e) => setSearchMinFatturatoAnnuale(e.target.value)}
                />
                <TextField
                  style={{ width: "180px" }}
                  label="Fatturato Massimo Annuale"
                  variant="outlined"
                  className="me-2"
                  value={searchMAxFatturatoAnnuale}
                  onChange={(e) => setSearchMaxFatturatoAnnuale(e.target.value)}
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
            {searchType == "dataUlCo" &&
              <div className="d-flex align-items-center">

                <TextField  type='date' label="Data Ultimo Contatto" 
                variant="outlined" color='tertiary'
                value={searchDataUltimoContatto} 
                onChange={(e) => setSearchDataUltimoContatto(e.target.value)}
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
            {searchType == "dataIn" &&
              <div className="d-flex align-items-center">

                <TextField  type='date' label="Data di inserimento" 
                variant="outlined" color='tertiary'
                value={searchDataInserimento} 
                onChange={(e) => setSearchDataInserimento(e.target.value)}
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
          </div>


          <div>
            <IconButton variant="contained" onClick={() => { fetchCustomers(""); handleResetSearch() }}>
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => navigate("/addcustomer")}
            >
              Aggiungi Cliente
            </Button>
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => handleEdit(selectedCustomerIds[0])}
              disabled={selectedCustomerIds.length !== 1}
            >
              Modifica
            </Button>
            <Button color='error' variant="contained" onClick={handleConfirmDelete} disabled={selectedCustomerIds.length === 0}>
              Elimina {selectedCustomerIds.length > 0 && `(${selectedCustomerIds.length})`}
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
                onCellClick={() => { }}
                rows={customers}
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
          <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>Conferma Eliminazione</DialogTitle>
          <DialogContent style={{ backgroundColor: "#1E1E1E" }}>
            <DialogContentText>
              Sei sicuro di voler eliminare {selectedCustomerIds.length} cliente{i => (selectedCustomerIds.length > 1 ? 'i' : '')} selezionato{i => (selectedCustomerIds.length > 1 ? 'i' : '')}?
            </DialogContentText>
          </DialogContent >
          <DialogActions style={{ backgroundColor: "#1E1E1E" }}>
            <Button onClick={() => setConfirmOpen(false)} color="primary">Annulla</Button>
            <Button onClick={""} color="error">Elimina</Button>
          </DialogActions>
        </Dialog>

        <Dialog maxWidth="md" open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>Modifica Cliente</DialogTitle>
          <DialogContent style={{ backgroundColor: "#1E1E1E" }}>
            <EditCliente fetchCustomers={fetchCustomers} customerId={editCustomerId} onClose={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
