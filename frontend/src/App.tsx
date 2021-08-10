import React from 'react';
import './App.css';
import { PromiseHandler } from './helpers';
import { userService } from './services';


function App() {

  const onClick = async ()=>{
   const [data,err] =  await PromiseHandler(userService.login("ljguerci","Soad2011"));
   if(err) throw new Error(err);
   console.log(data);
  }


  return (
    <div className="App">
      <button onClick={onClick}>Test</button>
    </div>
  );
}

export default App;
