
async function getPermission(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("Activated")
  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: checkPermissions
  })
}

async function checkPermissions(){
  console.log("hellowwwwww")

  var cameraPermission = null;
  var microphonePermission = null;
  var locationPermission = null;

  const cPermission = await navigator.permissions.query({name: 'camera'})
  console.log("camera state", cPermission.state);
  cameraPermission = cPermission.state;
  
  const mPermission = await navigator.permissions.query({name: 'microphone'})
  console.log("microphone state", mPermission.state);
  microphonePermission = mPermission.state;

  const lPermission = await navigator.permissions.query({name: 'geolocation'})
  locationPermission=lPermission.state;
  console.log("geolocation state", lPermission.state);
  

  chrome.runtime.sendMessage({
    action: "msgTransfer",
    permissions:  {cameraPermission,microphonePermission,locationPermission}
  })
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log("msg recieved in background.js inside content script" )
  //   if(request.action == "popup_click"){
  //     console.log("Message recieved and Get data from background")
  //     chrome.runtime.sendMessage({
  //       action: "msgTransfer",
  //       permissions:  {cameraPermission,microphonePermission,locationPermission}
  //     })
  //   }
  // })

}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("msg recieved in background.js")
  if(request.action == "popup_load"){
    console.log("action got")
    getPermission()
    
  }
})

//1- State not updating when hitting a url
//2-