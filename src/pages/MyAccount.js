import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { errorNoty, successNoty} from "../components/Notify";

export function MyAccount() {
    const navigate = useNavigate();

    const srcImg = localStorage.getItem("profilePic")



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className='container-fluid'>
                <h2 className='titlePage'>Il mio Account</h2>
            </div>
            <div className='mt-5'>
            <img src={srcImg}/>
            </div>
          
    
        </motion.div>
    );
}
