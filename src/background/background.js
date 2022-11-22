async function getPermission() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkPermissions,
  });
}

async function checkPermissions() {
  try {
    const cameraPermission = await navigator.permissions.query({
      name: "camera",
    });
    // console.log("camera state", cPermission.state);

    const microphonePermission = await navigator.permissions.query({
      name: "microphone",
    });
    // console.log("microphone state", mPermission.state);

    const locationPermission = await navigator.permissions.query({
      name: "geolocation",
    });
    chrome.runtime
      .sendMessage({
        action: "msgTransfer",
        permissions: {
          cameraPermission: cameraPermission.state,
          microphonePermission: microphonePermission.state,
          locationPermission: locationPermission.state,
        },
      })
      .then((msg) => {})
      .catch((e) => {
        console.log("Not able to send permissions to Popup.js", e);
      });
  } catch (e) {
    console.log("Some error occured while fetching permissions");
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

try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "popup_load") {
      getPermission();
    }
  });
} catch (e) {
  console.log("Cannot inject content script!!:", e);
}

// -------------------------------------------------Network Tab contents----------------------------------------------------------
var activeTab = -1;
var requestCountMapping = {};
var totalRequests = 0;
chrome.tabs.onActivated.addListener(function (details) {
  activeTab = details.tabId;
});
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.tabId == activeTab) {
      if (!(activeTab in requestCountMapping)) {
        requestCountMapping[activeTab] = {
          script: 0,
          stylesheet: 0,
          image: 0,
          xmlhttprequest: 0,
          other: 0,
        };
      }
      // console.log(details);
      // console.log(details.type);
      totalRequests += 1;
      console.log("totalRequests:", totalRequests);
      if (details.type in requestCountMapping[activeTab]) {
        requestCountMapping[activeTab][details.type] += 1;
      } else {
        requestCountMapping[activeTab].other += 1;
      }
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onRemoved.addListener((details) => {
  delete requestCountMapping[details];
  console.log("Updated dictionary after deleting:", requestCountMapping);
});
// chrome.tabs.onUpdated.addListener((details) => {
//   console.log("Page updated!", details);
// });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "popup_load") {
    chrome.runtime.sendMessage({
      action: "requestTransfer",
      data: { requestCount: requestCountMapping, activeTab },
    });
  }
});

// chrome.webNavigation.onCommitted.addListener((details) => {
//   if (["reload"].includes(details.transitionType)) {
//     // codeAfterReload();
//     console.log("After Page reloaded", totalRequests);
//     requestCountMapping[activeTab] = {
//       script: 0,
//       stylesheet: 0,
//       image: 0,
//       xmlhttprequest: 0,
//       other: 1,
//     };
//     totalRequests = 0;
//     console.log(requestCountMapping[activeTab]);
//     // If you want to run only when the reload finished (at least the DOM was loaded)
//     chrome.webNavigation.onCompleted.addListener(function onComplete() {
//       // codeAfterReloadAndFinishSomeLoading();
//       console.log("After page reloaded and loaded!!", totalRequests);
//       // chrome.webNavigation.onCompleted.removeListener(onComplete);
//     });
//   }
// });

//document==main_frame
//script
//font
//svg+xml
//image
//gif
//ping
//png
//xhr
//fetch
//stylesheet

//xmlhttprequest
//image
//other
//sub_frmae
//script
//ping
//stylesheet

//script
//image
//stylesheet --css
//xmlhttprequest
//other
