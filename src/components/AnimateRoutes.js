import React from 'react'
import { useState, useEffect } from "react";
import Homepage from '../pages/Homepage'
import { useSelector } from 'react-redux'; 
import Login from '../pages/Login';
import { CustomerList } from '../pages/CustomerList';
import Page_per from '../pages/Page_per';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import {PrivateRoutes, PrivatePerm, PrivateRoutesUser} from '../components/PrivateRoutes';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment/moment';
import 'moment/locale/it'
import { AddCliente } from '../pages/AddCliente';
import Register from '../pages/Register';
import { AddFatture } from '../pages/AddFatture';
import { FattureList } from '../pages/FattureList';
import { AddStatoFattura } from '../pages/AddStatoFattura';
import { AddIndirizzi } from '../pages/AddIndirizzi';
import { MyAccount } from '../pages/MyAccount';


function AnimateRoutes ()  {
    
    

    const location = useLocation();
    //const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
    const isAuth = useSelector((state) => state.auth.isAuth);
    console.log("isAuth state:", isAuth);
    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte nel tipo data
    var formattedDate = moment(today).format('DD-MM-YYYY');  //coverte nel formato richiesto
    localStorage.setItem("today", formattedDate);
    const [todayC, setTodayC] = useState(localStorage.getItem("today"));  //variabile che andiamo ad utilizzare



return (

    <AnimatePresence>
    <Routes location={location} key={location.pathname}>
      {/**qui ci vanno quelli che non servono i permessi, o se ne creano degli altri */}

    <Route element={<PrivateRoutes isAuth={isAuth}/>}> 

    
      <Route path="/" element={<Homepage />} /> 
      <Route path="/customerlist" element={<CustomerList />} /> 
      <Route path="/addcustomer" element={<AddCliente />} /> 
      <Route path="/listafatture" element={<FattureList />} />
      <Route path="/aggiungifatture" element={<AddFatture />} /> 
      <Route path="/aggiungistatofattura" element={<AddStatoFattura />} /> 
      <Route path="/addindirizzi" element={<AddIndirizzi />} /> 
      <Route path="/myaccount" element={<MyAccount />} /> 
      


    </Route>
 
        
    <Route path="/login" element={<Login  />} />
    <Route path="/register" element={<Register  />} />
    <Route path="/block" element={<Page_per/>} />

    
    {isAuth ? <Route path="*" element={<Page_per /> }/> :
              <Route path="*" element={<Login  />}/>    }
      
    </Routes>


    </AnimatePresence>

    )

}

export default AnimateRoutes 