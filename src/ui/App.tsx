import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styles from "./App.module.css";

function App() {
  const [count, setCount] = useState(0);
  const [UsageMode, setUsageMode] = useState("");

  useEffect(() => {
    pingElectron();
  }, [count]);

  async function pingElectron(){
    // @ts-ignore
    const response = await window.electronAPI.ping();
    console.log(response);
  }

  const handleClick = async ()=>{
    // @ts-ignore
    let response = await window.electronAPI.sendRequest();
    const responseObj = JSON.parse(response);
    console.log("Response from main process:", responseObj.contents);
    
  }

  return (
    <>
      <h1>GENAI</h1>
      <input className='no-drag' type="text" placeholder='Type @judge...'/>
        <button className='no-drag' onClick={()=>{handleClick()}}>Submit</button>
        
    </>
  )
}

export default App
