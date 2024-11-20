import * as React from 'react';
import { doc,  updateDoc} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { CircularProgress } from '@mui/material';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { useLocation } from 'react-router-dom'; 
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const drawerWidth = 400;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  width: 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

//serve per cambiare il colore del background della navbar
const colorBack = "#F1F1F1"

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: colorBack,
  color: 'black', 
  boxShadow: "none",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.2)",
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
    backgroundColor: colorBack, 
    color: 'black',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        backgroundColor: colorBack, 
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundColor: colorBack,
      },
    }),
  })
);


const ListItemCus = styled(ListItem)({
  padding: '10px 15px', 
  fontSize: '1.2rem',    
  
});

const ListItemTextCus = styled(ListItemText)({

});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
export default function MiniDrawer( {signUserOut} ) {

  const [notiPa, setNotiPa] = useState("");  //flag per comparire la notifica dot
  const [notiMessPA, setNotiMessPA] = useState(false);  //flag per far comparire il messaggio
  const [anchorElNoty, setAnchorElNoty] = useState(null);
  const [notiPaId, setNotiPaId] = useState("7k5cx6hwSnQTCvWGVJ2z"); 

  const [corsi, setCorsi] = useState([]); 
  const [argomenti, setArgomenti] = useState({});
  const [loadingcorsi, setLoadingcorsi] = useState(true); 
  const token = localStorage.getItem('authToken');
  const [openState, setOpenState] = useState({});
  const [loading, setLoading] = useState({});

  const location= useLocation();
  const currentArgomentoId = location.pathname.split('/').pop();

  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"))
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedItem, setSelectedItem] = useState('');


  //permessi utente
  

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuNoty = async (event) => {
    if(notiPa == "dot") {
      setAnchorElNoty(event.currentTarget);
    }
    await updateDoc(doc(db, "notify", notiPaId), { NotiPa: false });  //va a modificare il valore della notifica
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNoty = () => {
    setAnchorElNoty(null);
    setNotiMessPA(false)
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const fetchCorso = async (id) => {  
      try {
        const response = await fetch(`http://localhost:3001/corso/me`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });

        // Gestione della risposta
        if (response.ok) {
          const data = await response.json();
          setCorsi(data);
          setLoadingcorsi(false); 
        } else {
          throw new Error('Errore nel recupero dei dati');
        }
      } catch (err) {
        console.error('Errore:', err);
        setLoadingcorsi(false); 
    };
  }

  const handleToggle = async (idCorso) => {
    setOpenState((prev) => ({
      ...prev,
      [idCorso]: !prev[idCorso],
    }));
  
    if (!argomenti[idCorso] && !loading[idCorso]) {
      setLoading((prev) => ({ ...prev, [idCorso]: true })); 
  
      try {
        const data = await fetchArgomentiPerCorso(idCorso);
        if (data) {
          setArgomenti((prev) => ({
            ...prev,
            [idCorso]: data,
          }));
        }
      } catch (err) {
        console.error(`Errore nel caricamento degli argomenti per il corso ${idCorso}`, err);
      } finally {
        setLoading((prev) => ({ ...prev, [idCorso]: false }));
      }
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
      setArgomenti((prev) => ({ ...prev, [idCorso]: data }));


    } catch (err) {

    }
  };

  const updateArgomentiPerCorso = async (idCorso) => {
    try {
      console.log("sono entrato")
      const response = await fetch(`http://localhost:3001/argomento/corso/${idCorso}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setArgomenti((prev) => ({ ...prev, [idCorso]: data }));
    } catch (err) {

    }
  };


useEffect(() => {
  fetchCorso()
},[])


//***********USE EFFECT*********************************************** */
  useEffect(() => {
    // Ascolta i cambiamenti nell'URL e imposta l'elemento selezionato in base all'URL
    switch (location.pathname) {       
      case '/customerlist':
          setSelectedItem('customerlist');
        break;
      case '/dashclienti':
          setSelectedItem('customerlist');
        break;
        case '/addcustomer':
          setSelectedItem('addcustomer');
        break;
      case '/aggiungifatture':
        setSelectedItem('aggiungifatture');
        break;
      case '/listafatture':
        setSelectedItem('listafatture');
        break;
      case '/nota':
        setSelectedItem('ordineclientidata');
        break;
      default:
        setSelectedItem('homepage');
        break;
    }
  }, [location.pathname]);
//________________________________________________________________________________________
    //Notifiche
    {/** 
    React.useEffect(() => {
      const collectionRef = collection(db, "notify");
      const q = query(collectionRef, );
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = [];
        querySnapshot.forEach((doc) => {
          todosArray.push({ ...doc.data(), id: doc.id });
        });
        setTodoNoti(todosArray);
      });
      return () => unsub();
    }, [location.pathname]);

        React.useEffect(() => {  //Notifica Pa
          todoNoti.map( (nice) => {
            if(nice.NotiPa == true){
              setNotiPa("dot")
              setNotiMessPA(true)
            } else {
              setNotiPa("")
            }
          } )
        }, [todoNoti]);
*/}
//________________________________________________________________________________________
  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} open={open} color='secondary'>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>


        <div>
        <>
          <Badge color="error" variant={notiPa} style={{ marginRight: "20px" }}>
            <NotificationsIcon onClick={handleMenuNoty} style={{color: "black"}}/>
          </Badge>
          <Menu  sx={
        { mt: "1px", "& .MuiMenu-paper": 
        { backgroundColor: "#333",
          color: "white" }, 
        }
        }
                id="menu-appbar"
                anchorEl={anchorElNoty}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNoty)}
                onClose={handleCloseNoty}
              >
                {notiMessPA && <MenuItem onClick={handleCloseNoty}>Pa è stato modificato</MenuItem>}
                
          </Menu>
              </>
     
        </div>
   

          <div >
            <Avatar alt="Remy Sharp" src={localStorage.getItem("profilePic")} onClick={handleMenu}/>
              <Menu  sx={
        { mt: "1px", "& .MuiMenu-paper": 
        { backgroundColor: "#F9F9F9",
          color: "white" }, 
        }
        }
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={() => {handleClose(); navigate("/myaccount")}}>My account</MenuItem>
                <MenuItem onClick={ () => {handleClose(); navigate("/login")}}>LogIn</MenuItem>
                <MenuItem onClick={ () => {signUserOut(); handleClose(); localStorage.setItem(false,"isAuth"); setIsAuth(false); navigate("/login")}}>LogOut</MenuItem> 

                
              </Menu>
            </div>

        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} 
         PaperProps={{
       sx: {
      color: "black",
      border: "none",
    }
  }}
      >
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0 8px' }}>
          <IconButton onClick={handleDrawerClose} >
           <ChevronLeftIcon sx={{ fontSize: '2rem'}}/>
          </IconButton>
          <div className='d-flex align-items-center gap-3'> 
            <h4 className='mb-0'>Corsi</h4>
          </div>
        </DrawerHeader>
        <Divider />

        <List sx={{padding: "0px"}}>
  


        {/*******Corsi e argomenti */}
        {corsi.map((corso) => {
        const corsoArgomenti = argomenti[corso.id] || [];
        const isOpen = openState[corso.id] || false; 
        const isLoading = loading[corso.id]; 

        return (
          <ListItemCus key={corso.id} disablePadding sx={{ display: "block" }}>
            <ListItemButton style={{ borderRadius: "10px" }} onClick={() => handleToggle(corso.id)}>
              <ListItemText
                primary={corso.nomeCorso}
                primaryTypographyProps={{ fontSize: '20px' }}
                sx={{ opacity: 1 }}
              />
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {isLoading ? (
                  <CircularProgress size={24} /> // Mostra un caricamento
                ) : corsoArgomenti.length > 0 ? (
                  corsoArgomenti.map((argomento) => {
                   
                    const isSelected = argomento.id.toString() === currentArgomentoId; 
                    return (
                      <ListItem key={argomento.id} style={{padding: "2px 0px"}}>
                        <ListItemButton
                          style={{ borderRadius: "10px", backgroundColor: isSelected ? '#E7E7E7' : 'transparent' }}
                          onClick={() => { navigate(`/argomento/${argomento.id}`); }} // Naviga all'argomento selezionato
                        >
                          <ListItemText
                            primary={argomento.titolo}
                            primaryTypographyProps={{
                              fontSize: '18px',
                              fontWeight: isSelected ? 'bold' : 'normal', // Grassetto se selezionato
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItemText primary="Nessun argomento trovato." />
                )}
              </List>
            </Collapse>
          </ListItemCus>
        );
      })}


        </List>

      </Drawer>

    </Box>
  );
}