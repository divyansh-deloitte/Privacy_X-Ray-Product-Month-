
async function getPermission(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: checkPermissions
  })
}

async function checkPermissions(){

  try{
      const cameraPermission = await navigator.permissions.query({name: 'camera'})
      // console.log("camera state", cPermission.state);
    
      const  microphonePermission = await navigator.permissions.query({name: 'microphone'})
      // console.log("microphone state", mPermission.state);
      
      const locationPermission = await navigator.permissions.query({name: 'geolocation'})
      chrome.runtime.sendMessage({
        action: "msgTransfer",
        permissions:  {
          cameraPermission: cameraPermission.state,
          microphonePermission:microphonePermission.state,
          locationPermission: locationPermission.state
        }
      }).then((msg) => {
      })
      .catch((e) => {
        console.log("Not able to send permissions to Popup.js",e);
      });

  }catch(e){
    console.log("Some error occured while fetching permissions")
  }
 
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

try{
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action == "popup_load"){
    getPermission();
  }
})
}catch(e){
  console.log("Cannot inject content script!!:",e)
}
//1- State not updating when hitting a url
//2-






//
//Cookies code//
//




  
  
