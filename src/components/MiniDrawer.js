import * as React from 'react';
import { doc,  updateDoc} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import { supa } from '../components/utenti';
import { tutti } from '../components/utenti';
import { styled, useTheme } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import ViewListIcon from '@mui/icons-material/ViewList';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TaskIcon from '@mui/icons-material/Task';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ListItemText from '@mui/material/ListItemText';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useLocation } from 'react-router-dom'; 

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
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
    width: drawerWidth,
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
        backgroundColor: colorBack, // Assicura che la carta del drawer abbia lo stesso colore
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundColor: colorBack, // Assicura che la carta del drawer abbia lo stesso colore
      },
    }),
  })
);

export default function MiniDrawer( {signUserOut} ) {

  const [todoNoti, setTodoNoti] = React.useState([]);  //array notifica
  const [notiPa, setNotiPa] = React.useState("");  //flag per comparire la notifica dot
  const [notiMessPA, setNotiMessPA] = React.useState(false);  //flag per far comparire il messaggio
  const [anchorElNoty, setAnchorElNoty] = React.useState(null);
  const [notiPaId, setNotiPaId] = React.useState("7k5cx6hwSnQTCvWGVJ2z");  //id NotificapPa per modificare all'interno del database

  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = React.useState(localStorage.getItem("isAuth"))
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [selectedItem, setSelectedItem] = useState('');

  //Open sottocategorie
  const [openSottocategoria, setOpenSottocategoria] = React.useState(false);
  const [openSottocategoriaProd, setOpenSottocategoriaProd] = React.useState(false);
  const [openSottocategoriaOrd, setOpenSottocategoriaOrd] = React.useState(false);
  const [openSottocategoriaForn, setOpenSottocategoriaForn] = React.useState(false);

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  const location= useLocation();

//sottocategorie Clienti
  const handleClickSottoCategoria = () => {
    setOpenSottocategoria(!openSottocategoria);
  };
  const handleMouseEnter = () => {
    setOpenSottocategoria(true);
    setOpenSottocategoriaProd(false);
    setOpenSottocategoriaOrd(false);
  };
  const handleMouseLeave = () => {
    setOpenSottocategoria(false);
  };

  //Sottocategorie Prodotti
  const handleClickSottoCategoriaProd = () => {
    setOpenSottocategoriaProd(!openSottocategoriaProd);
  };
  const handleMouseEnterProd = () => {
    setOpenSottocategoriaProd(true);
    setOpenSottocategoria(false);
    setOpenSottocategoriaOrd(false);
    setOpenSottocategoriaForn(false);
  };
  const handleMouseLeaveProd = () => {
    setOpenSottocategoriaProd(false);
  };

    //Sottocategorie Ordini
    const handleClickSottoCategoriaOrd = () => {
      setOpenSottocategoriaOrd(!openSottocategoriaOrd);
    };
    const handleMouseEnterOrd = () => {
      setOpenSottocategoriaOrd(true);
      setOpenSottocategoria(false);
      setOpenSottocategoriaProd(false)
      setOpenSottocategoriaForn(false);
    };
    const handleMouseLeaveOrd = () => {
      setOpenSottocategoriaOrd(false);
    };

     //Sottocategorie Fornitori
     const handleClickSottoCategoriaForn = () => {
      setOpenSottocategoriaForn(!openSottocategoriaForn);
    };
    const handleMouseEnterForn = () => {
      setOpenSottocategoriaForn(true);
      setOpenSottocategoria(false);
      setOpenSottocategoriaProd(false)
      setOpenSottocategoriaOrd(false)
    };
    const handleMouseLeaveForn = () => {
      setOpenSottocategoriaForn(false);
    };   


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
      <AppBar position="fixed" elevation={10} open={open} color='secondary'>
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
        {sup &&
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
            }
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
        <DrawerHeader >
          <div className='d-flex align-items-center gap-3'> 
            Flash Card
            
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon/>}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>

        <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/")}}>
              <ListItemButton
              
          selected={selectedItem === "homepage"}
          onClick={(event) => handleListItemClick(event, 7)}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <HomeIcon  sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="HomePage" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>





    {/** 
      <div >
      <ListItem  disablePadding sx={{ display: 'block', backgroundColor: openSottocategoriaOrd ? 'white' : 'initial' }}>
      <ListItemButton onMouseEnter={handleMouseEnterOrd }  onClick={handleClickSottoCategoriaOrd}  >
        <ListItemIcon>
          <ViewListIcon sx={{ color: openSottocategoriaOrd ?  "black" : "white" }} />
        </ListItemIcon>
        <ListItemText sx={{ color: openSottocategoriaOrd ? 'black' : 'white' }} primary="Fatture Clienti" />
        {openSottocategoriaOrd ? <ExpandLess sx={{ color: 'black' }} /> : <ExpandMore />}
      </ListItemButton>
      </ListItem>
      <Collapse in={openSottocategoriaOrd} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/listafatture")}}>
                <ListItemButton sx={{ pl: 4 }}
                    selected={selectedItem === "listafatture"}
                  onClick={(event) => handleListItemClick(event, 9)}>
                  <ListItemIcon sx={{ minWidth: 0,mr: open ? 3 : 'auto'}}>
                    <TaskIcon sx={{ color: "white" }}/>
                  </ListItemIcon>
                  <ListItemText primary="Fatture" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/aggiungifatture")}}>
                <ListItemButton sx={{ pl: 4 }}
                    selected={selectedItem === "aggiungifatture"}
                  onClick={(event) => handleListItemClick(event, 10)}>
                  <ListItemIcon sx={{ minWidth: 0,mr: open ? 3 : 'auto'}}>
                    <PostAddIcon sx={{ color: "white" }}/>
                  </ListItemIcon>
                  <ListItemText primary="Aggiungi Fatture" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
        </List>
      </Collapse>
      </div>
      */}


        </List>

      </Drawer>

    </Box>
  );
}