import { useHistory } from "react-router-dom";
import './logout.scss';

export default function Logout(){
  const history = useHistory();

  const handleLogout = ()=>{
    sessionStorage.removeItem('AUTH_ACCESS_TOKEN');
    sessionStorage.removeItem('AUTH_REFRESH_TOKEN');
    history.push('/login');
  }

  return(
      <button onClick={handleLogout}>Cerrar Sesión</button>
  )
}