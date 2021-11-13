import React,{useState,useEffect} from 'react'

import logo from './logo.svg';
import './App.css';
import { useDebounce, useThrottle,useLocalStorage } from './Hooks';
import MySelectTest from './SelectCheckBox/MySelectTest';
import { set } from 'lodash';



function App() {
  const [state, setState] = useState(0)
  const [name, setName] = useLocalStorage("test", [1,2,3]);
  useEffect(() =>  setName([4,5,6]), [])

  const inc=useDebounce(()=>setState(state+1),1000)
  const dec=useThrottle(()=>setState(state-1),1000)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="center">
        <button onClick={()=>inc()}>use Debounce, state++ </button>
        <button onClick={()=>dec()}>use Throttle, state-- </button>
      </div>
      <h1>State: {state}</h1>
      <h1>Select:</h1>
      <MySelectTest/>

    </div>
  );
}

export default App;
