import React,{useEffect,useState} from 'react'
import { render } from 'react-dom'
import './popup.css'

const App= () => {
  
  const [ cameraPermission, setCameraPermission ] = useState("");
  const [ microphonePermission, setMicrophonePermission ] = useState("");
  const [ locationPermission, setLocationPermission ] = useState("");
  
  useEffect(()=>{
 
    chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
      chrome.runtime.sendMessage( {action: "popup_load"}).then((msg)=>{}).catch((e)=>{
        console.log("Cannot request background.js to fetch permission",e)
      })
    })
  },[])

  try{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action == "msgTransfer"){
      console.log("permission print")
      console.log(request.permissions);
      setCameraPermission(request.permissions.cameraPermission);
      setMicrophonePermission(request.permissions.microphonePermission);
      setLocationPermission(request.permissions.locationPermission);
    }
  })
  }catch(e){
    console.log("Cannot fetch permission from background.js",e)
  }
  return (
    <div>
      <h2>Permissions</h2>
      <div>
      <button className={(cameraPermission=="granted"?"permission-btn-state-granted":(cameraPermission=="denied"?"permission-btn-state-denied":"permission-btn-state-default"))}>Camera</button>
      <button className={(microphonePermission=="granted"?"permission-btn-state-granted":(microphonePermission=="denied"?"permission-btn-state-denied":"permission-btn-state-default"))}>Microphone</button>
      <button className={(locationPermission=="granted"?"permission-btn-state-granted":(locationPermission=="denied"?"permission-btn-state-denied":"permission-btn-state-default"))}>Location</button>
     <hr />
     </div>
     <br />
     <span>{`Camera :${cameraPermission}`}</span>
      <span>{`Microphone :${microphonePermission}`}</span>
      <span>{`Location :${locationPermission}`}</span>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
