import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { successNoty, errorNoty } from '../components/Notify';
import { loginU } from '../redux/reducers/authSlice';

function Register() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const API = process.env.REACT_APP_BACKEND;

  // Riferimenti ai campi del form
  const emailRef = useRef();
  const passwordRef = useRef();
  const nomeRef = useRef();
  const cognomeRef = useRef();
  const avatarRef = useRef(); // Puoi lasciare vuoto se non usato
  const usernameRef = useRef(); // Aggiungi un riferimento per username

  const handleRegister = async () => {
    // Ottieni i valori dai riferimenti
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const nome = nomeRef.current.value;
    const cognome = cognomeRef.current.value;
    const avatar = avatarRef.current.value || ""; // Se avatar non è specificato, invia una stringa vuota
    const username = usernameRef.current.value || email.split('@')[0]; // Usa l'email per derivare un username se non è specificato

    const userData = {
      username: username, // Usa il campo 'username' fornito dall'utente, o derivato dall'email
      nome: nome,
      cognome: cognome,
      email: email,
      password: password,
      avatar: avatar
    };

    // Effettua la richiesta POST
    try {
      const response = await fetch(API + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        successNoty("Registrato Correttamente")
        //dispatch(loginU(data)); 
        navigate("/login"); 
      } else {
        errorNoty(
          data.message || "Errore durante la registrazione"
        );
      }
    } catch (error) {
      console.error('Errore nella connessione:', error);
      alert('Errore nella connessione. Riprova.');
    }
  }

  return (
    <div className='w-100'>
      <div className="w-100 ps-4 ps-md-0">
        <section className="w-100">
          <div className=" py-1 w-100">
            <div className="row d-flex justify-content-center align-items-center h-70 w-100">
              <div className="col-12 col-md-8  ">
                <div className="card gradientNice p-3 text-black" style={{borderRadius: "2rem"}}>
                  <div className="card-body bg-white p-3 px-5 text-center" style={{borderRadius: "2rem"}}>

                    <div className="mb-md-4 mt-md-4 pb-5">

                      <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                      <img style={{width: "200px"}} src='logo.jpg'/>
                     
                      <p className="text-black-50 mb-5">Please enter your email and password</p>

                      {/* Campo per username */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typeUsernameX">Username</label>
                        <input ref={usernameRef} type="text" id="typeUsernameX" className="form-control form-control-lg" placeholder="Inserisci username" />
                      </div>

                      {/* Campo per email */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                        <input ref={emailRef} type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Inserisci email" />
                      </div>

                      {/* Campo per password */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                        <input ref={passwordRef} type="password" id="typePasswordX" className="form-control form-control-lg" placeholder="Inserisci password" />
                      </div>

                      {/* Campo per nome */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typeNomeX">Nome</label>
                        <input ref={nomeRef} type="text" id="typeNomeX" className="form-control form-control-lg" placeholder="Inserisci nome" />
                      </div>

                      {/* Campo per cognome */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typeCognomeX">Cognome</label>
                        <input ref={cognomeRef} type="text" id="typeCognomeX" className="form-control form-control-lg" placeholder="Inserisci cognome" />
                      </div>

                      {/* Campo per avatar (opzionale) */}
                      <div className="form-outline form-white mb-4">
                        <label className="form-label" htmlFor="typeAvatarX">Avatar (opzionale)</label>
                        <input ref={avatarRef} type="text" id="typeAvatarX" className="form-control form-control-lg" placeholder="Inserisci URL avatar" />
                      </div>

                      <button className="btn gradientNice text-white btn-lg px-5" type="submit" onClick={handleRegister}>Register</button>
                    </div>

                    <div>
                      <p className="mb-0">Hai già un account? <a style={{ cursor: 'pointer' }} onClick={() => {navigate("/login")}} className="text-black-50 fw-bold">Accedi</a></p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register;
