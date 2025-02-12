import React, { useEffect, useState } from 'react'
import { BrowserRouter as  Router}  from 'react-router-dom';
import Authapi from '../utils/Authapi';
import Roter from './files/Roter';
import { hasSignned } from './files/Auth-api';
import Homepage from './Homepage';
const App = () => {

  const [auth,setAuth]=useState(false);
  const readSession = async () =>{
    const res = await hasSignned();
    if(res.data.auth){
        setAuth(true);
    }
  };
useEffect(() => {
readSession();
},[]);
  return (
    <>
<Authapi.Provider value={{auth,setAuth}}>
    <Router>
      <Roter/>
    </Router>
</Authapi.Provider>
 </>
  );
}

export default App