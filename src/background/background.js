chrome.tabs.onActivated.addListener(async () => {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: checkPermissions
  })
});

function checkPermissions(){
  console.log("hellowwwwww")

  var cameraPermission = null;
  var microphonePermission = null;
  var locationPermission = null;

  navigator.permissions.query({name: 'camera'})
  .then((permission) => {
      console.log("camera state", permission.state);
      cameraPermission = permission.state;
  }).catch((error) => {
      console.log('Got error :', error);
  })

  navigator.permissions.query({name: 'microphone'})
  .then((permission) => {
      console.log("microphone state", permission.state);
      microphonePermission = permission.state;
  }).catch((error) => {
      console.log('Got error :', error);
  })

  navigator.permissions.query({name: 'geolocation'})
  .then((permission) => {
      locationPermission=permission.state;
      console.log("geolocation state", permission.state);
  }).catch((error) => {
      console.log('Got error :', error);
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action == "popup_click"){
      chrome.runtime.sendMessage({
        action: "msgTransfer",
        permissions:  {cameraPermission,microphonePermission,locationPermission}
      })
    }
  })

}

