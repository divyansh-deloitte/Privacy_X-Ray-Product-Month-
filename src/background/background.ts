// // TODO: background script
// chrome.runtime.onInstalled.addListener(() => {
//   // TODO: on installed function
// });

// setInterval(() => {
//   console.log("HI");
// }, 3000);

console.log("hi");
var dic = {};
var activeTab = -1;
var oldActiveTab = activeTab;
chrome.tabs.onActivated.addListener(function (details) {
  console.log("Current active tab", details.tabId);
  activeTab = details.tabId;
  // toggleMuteState(activeTab);
});

/* Listen for web-requests and filter them */

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.tabId == -1) {
      console.log("Skipping request from non-tabbed context...");
      return;
    }
    // console.log(activeTab);
    var reqs = [];
    if (!(activeTab in dic)) {
      dic[activeTab] = [];
    }
    if (activeTab == details.tabId) {
      /* We are interested in this request */
      // console.log();
      // console.log("Check this active tab:", details);
      dic[activeTab].push(details);
      toggleMuteState(activeTab);
    } else {
      console.log("not from active tab", details);
    }
    abc();
  },
  { urls: ["<all_urls>"] }
);

function abc() {
  console.log(dic);
}

// const timeInterval = setInterval(() => {
//   chrome.runtime
//     .sendMessage({ greeting: "hello", dataRequests: dic, activeTab })
//     .then((msg) => {
//       console.log("message sent to popup.js");
//     })
//     .catch((e) => {
//       console.log("Cannot send data to popup.js");
//     });
// }, 10000);

const timeInterval = setInterval(() => {
  sendDataToDom();
}, 10000);

// setTimeout(() => {}, 3000);

chrome.webRequest.onResponseStarted.addListener(
  function (details) {
    // toggleMuteState(activeTab);
    console.log("Response goes here--", details);
  },
  { urls: ["<all_urls>"] }
);

// while (true) {
//   if (oldActiveTab != activeTab) {
//     console.log("old active tab changed!");
//     oldActiveTab = activeTab;
//   }
// }

// const timer = setInterval(() => {
//   //   logRequest(activeTab);
//   console.log("hello AGain");
// }, 5000);
// if (toggleMuteState(activeTab) == "completed") {
//   clearInterval(timer);
// }

// window.onload = function () {
//   console.log("Page loaded Successfully!!");
// };

async function toggleMuteState(activeTab) {
  const tab: any = await chrome.tabs.get(activeTab, () => {});
  console.log(activeTab);
  console.log("Tab Status is", tab.status);
  if (tab.status == "complete") {
  }
  return tab.status;
}

function sendDataToDom() {
  // chrome.runtime
  //   .sendMessage({ greeting: "hello", dataRequests: dic, activeTab })
  //   .then((msg) => {
  //     console.log("message sent to popup.js");
  //   })
  //   .catch((e) => {
  //     console.log("Cannot send data to popup.js");
  //   });

  try {
    chrome.runtime.sendMessage({ greeting: "hello", dataRequests: dic });
  } catch (e) {
    console.log("Error occured at background");
  }
}
