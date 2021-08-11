import React,{FormEvent, useState} from 'react'
import { useHistory } from "react-router-dom";
import { PromiseHandler } from '../../helpers';
import { useForm } from '../../hooks';
import { userService } from '../../services';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './login.scss';

export default function Login(){

  const FORM = {
    username:{
        validation:/^[A-Za-z]{8,50}$/,
        value: '',
    },
    password:{
        validation:/^[A-Za-z0-9]{8,50}$/,
        value: '',
    },
  }

  const [form,resetForm] = useForm(FORM);
  const [showPassword,setShowPassword] = useState(true);

  let history = useHistory();
  const onSubmit = async (e:FormEvent)=>{
    e.preventDefault();
    console.log(form)
    if(!form.status.isValid) return;
    const [data,err] = await PromiseHandler(userService.login(form.username.value,form.password.value));
    if(err) console.error(err);
    sessionStorage.setItem('AUTH_ACCESS_TOKEN', data.login.token);
    sessionStorage.setItem('AUTH_REFRESH_TOKEN', data.login.refreshToken);
    resetForm();
    history.push('/home');
  }

  return(
    <div className="Login">
      <form onSubmit={onSubmit}>
        <input type="text" name="username" {...form.username.bind}/>
        <input type={showPassword ? "text" : "password"} name="password" {...form.password.bind}/>
        <div>
          <input type="submit" value="Iniciar Sesión"/>
          <button onClick={()=>setShowPassword(!showPassword)}>
            { showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/> }
          </button>
        </div>
      </form>
    </div>
  );
}