import { Outlet, Navigate } from 'react-router-dom'
import { tutti, dipen, guid, supa } from './utenti';


export function PrivateRoutes({ isAuth, isAuthUser }) {

    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    
    return <Outlet />;
}



export function PrivatePerm({}) {
    let ta= tutti.includes(localStorage.getItem("uid"))  //questo è un ulteriore controllo, solo per gli utenti supervisori, per i permessi
    return (
        ta ? <Outlet/> : <Navigate to="/block"/>
    );
}
