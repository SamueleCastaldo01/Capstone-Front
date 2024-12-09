import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Stili predefiniti di ReactQuill
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { motion } from "framer-motion";
import { errorNoty, successNoty } from "../components/Notify";

function IMieiAppunti() {

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [corsi, setCorsi] = useState([]); 
  const scrollContainerRef = useRef(null); 
  const API = process.env.REACT_APP_BACKEND;


  const token = localStorage.getItem("authToken");
  localStorage.setItem("naviBottom", 0); 
  let navigate = useNavigate();


  const fetchCorso = async () => {
    try {
      const response = await fetch(API + `/corso/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        
        setCorsi(data); 
        setLoading(false);
      } else {
        errorNoty(data.message);
        throw new Error("Errore nel recupero dei dati");
      }
    } catch (err) {
      console.error("Errore:", err);
      setError(err.message);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCorso();
  }, []);

  // Funzioni per il drag-to-scroll
  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    container.isDown = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    container.isDown = false;
  };

  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container.isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 1.3;
    container.scrollLeft = container.scrollLeftStart - walk;
  };


  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className='px-4 pt-3 px-lg-0 divPrincipale'>
            <div className="d-flex gap-1 align-items-center">
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon style={{ color: "black" }} />
                </IconButton>
                <h1
                    onClick={() => navigate(-1)}
                    className="mb-0 cursor-pointer"
                >
                    I Miei Appunti
                </h1>
            </div>

            {/* Scroll Container */}
            <div
            ref={scrollContainerRef}
            className="scroll-container px-4 px-lg-0 text-center d-flex align-items-center gap-4"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            >
            {loading ? (
                <p>Caricamento...</p>
            ) : error ? (
                <p>Errore: {error}</p>
            ) : (
                corsi.map((corso) => (
                <div
                    className="flashIndex position-relative"
                    key={corso.id}
                    onDoubleClick={() => navigate("/corso/" + corso.id)}
                    style={{ borderLeft: `50px solid ${corso.coloreCopertina}` }}
                >
                    <h2 className="fakeLink" onClick={() => {navigate("/corso/" + corso.id)}}>{corso.nomeCorso}</h2>
                    <Button onClick={() => {navigate("/flashcard/0/" + corso.id)}} className="position-absolute bottom-45" variant="contained"> FlashCard</Button>
                </div>
                ))
            )}
            </div>

        </div>


      </motion.div>
    </>
  );
}

export default IMieiAppunti;
