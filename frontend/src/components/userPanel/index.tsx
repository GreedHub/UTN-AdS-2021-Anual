import { useEffect, useState } from "react";
import { token } from '../../helpers';
import Logout from "../logout";
import './userPanel.scss';

export default function UserPanel(){
  
  const [username,setUsername] = useState("");

  useEffect(()=>{
    const _token = `${sessionStorage.getItem('AUTH_ACCESS_TOKEN')}`;
    const decoded = token.getPayload(_token)
    setUsername(decoded.username)
  },[]);

  return(
    <div className="UserPanel">
      <h3 className="UserPanel__title">UserPanel</h3>
      <p className="UserPanel__welcome">Bienvenido {username}</p>
      <Logout/>
    </div>
  )
}