import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginU } from '../redux/reducers/authSlice';
import { successNoty, errorNoty } from '../components/Notify';

function Login() {
  const dispatch = useDispatch();
  let navigate = useNavigate();  
  const API = process.env.REACT_APP_BACKEND;


  const emailRef = useRef();
  const passwordRef = useRef();

  // Funzione di login
  async function handelLogin () {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(API +  '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();


      if (response.ok) {
        localStorage.setItem("profilePic", 'http://res.cloudinary.com/dk15nwyte/image/upload/v1731681603/zeepxk1lwrftzphsf19d.jpg');
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem("isAuth", true);
        dispatch(loginU(data.token));  // Usa il tuo reducer per il login, se necessario
        successNoty("Credenziali Valide")
        navigate("/");
      } else {
        errorNoty(
          data.message
        );
      }
    } catch (error) {
   
      errorNoty(
        error.message
      );
      console.error('Errore nella connessione:', error);
    }
  }


  const forgotPassword = () => {
    navigate("/recoverpassword");
  };

  return (
    <>
      <div className='w-100'>  
        <div className="w-100">
          <section className="w-100">
            <div className="w-100 py-1">
              <div className="row d-flex justify-content-center align-items-center h-70 w-100">
                <div className="col-12 col-md-8">
                  <div className="card gradientNice p-3 text-black" style={{borderRadius: "2rem"}}>
                    <div className="card-body bg-white p-3 px-5 text-center" style={{borderRadius: "2rem"}}>

                      <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                        <img src='logo.jpg' style={{width: "200px"}}/>
                        <h2 className="fw-bold mb-2 text-uppercase"></h2>
                        <p className="text-white-50 mb-5">Please enter your email and password</p>

                        <div className="form-outline form-white mb-4">
                          <label className="form-label" htmlFor="typeEmailX">Email</label>
                          <input ref={emailRef} type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Inserisci email"/>
                        </div>

                        <div className="form-outline form-white mb-4">
                          <label className="form-label" htmlFor="typePasswordX"> Password</label>
                          <input ref={passwordRef} type="password" id="typePasswordX" className="form-control form-control-lg" placeholder="Inserisci password"/>
                        </div>

                        <p className="small mb-5 pb-lg-2" onClick={forgotPassword}>
                          <a className="text-white-50">Forgot password?</a>
                        </p>

                        <button className="btn gradientNice text-white btn-lg px-5" type="submit" onClick={handelLogin}>Login</button>

                      </div>

                      <div>
                        <p className="mb-0">Non hai un account? <a style={{ cursor: 'pointer' }} onClick={() => {navigate("/register")}} className="text-black-50 fw-bold">Registrati</a></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;
