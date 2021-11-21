import React,{useState,useEffect} from 'react'
import logo from './logo.svg';
import { useDebounce, useThrottle,useLocalStorage } from './Hooks';
import MySelectTest from './SelectCheckBox/MySelectTest';
import TestTable from './Table/TestTable';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';



function App() {
  const [state, setState] = useState(0)
  // const [name, setName] = useLocalStorage("test", [1,2,3]);
  // useEffect(() =>  setName([4,5,6]), [])

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
      {/* <h1>Select:</h1>
      <MySelectTest/> */}
      <TestTable/>
    </div>
  );
}

export default App;
