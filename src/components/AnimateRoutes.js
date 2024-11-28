import React from 'react'
import { useState, useEffect } from "react";
import Homepage from '../pages/Homepage'
import { useSelector } from 'react-redux'; 
import Login from '../pages/Login';
import Page_per from '../pages/Page_per';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import {PrivateRoutes, PrivatePerm, PrivateRoutesUser} from '../components/PrivateRoutes';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment/moment';
import 'moment/locale/it'
import Register from '../pages/Register';
import { MyAccount } from '../pages/MyAccount';
import Argomento from '../pages/Argomento';
import AddCorso from '../pages/AddCorso';
import Corso from '../pages/Corso';
import FlashCard from '../pages/FlashCard';


function AnimateRoutes ({fetchArgomentiPerCorso, fetchCorsoPrp})  {
    
    const location = useLocation();
    //const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
    const isAuth = useSelector((state) => state.auth.isAuth);


return (

    <AnimatePresence>
    <Routes location={location} key={location.pathname}>
      {/**qui ci vanno quelli che non servono i permessi, o se ne creano degli altri */}

    <Route element={<PrivateRoutes isAuth={isAuth}/>}> 
      <Route path="/" element={<Homepage />} /> 
      <Route path="/argomento/:id" element={<Argomento fetchArgomentiPerCorso= {fetchArgomentiPerCorso}/>} /> 
      <Route path="/corso/:id" element={<Corso fetchArgomentiPerCorso= {fetchArgomentiPerCorso} fetchCorsoPrp={fetchCorsoPrp}/>} /> 
      <Route path="/myaccount" element={<MyAccount />} /> 
      <Route path="/addcorso" element={<AddCorso fetchCorsoPrp={fetchCorsoPrp}/>} /> 
      <Route path="/flashcard/:id" element={<FlashCard/>} /> 
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