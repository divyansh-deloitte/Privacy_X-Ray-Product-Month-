import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./popup.css";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
// import { BarChart } from "../chart/Chart";

const App = () => {
  const [cameraPermission, setCameraPermission] = useState("");
  const [microphonePermission, setMicrophonePermission] = useState("");
  const [locationPermission, setLocationPermission] = useState("");
  const [activeTab, setActiveTab] = useState(-1);
  const [allRequestCount, setAllRequestCount] = useState({
    script: 0,
    stylesheet: 0,
    image: 0,
    xmlhttprequest: 0,
    other: 1,
  });

  console.log(
    "total rescources:",
    window.performance.getEntriesByType("resource").length
  );

  const [totalRequests, setTotalRequests] = useState(0);
  const labels = ["Javascript", "Design", "Images", "Requests", "Other"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Request Types",
        backgroundColor: [
          "rgba(75,192,192,1)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(53, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        data: allRequestCount ? Object.values(allRequestCount) : [],
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Request types with count",
        fontSize: 50,
      },
    },
  };
  useEffect(() => {}, [allRequestCount]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime
        .sendMessage({ action: "popup_load" })
        .then((msg) => {})
        .catch((e) => {
          console.log("Cannot request background.js to fetch permission", e);
        });
    });

    // console.log("Tabs data--:", tab.id);
  }, []);

  try {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action == "msgTransfer") {
        console.log("permission print");

        setCameraPermission(request.permissions.cameraPermission);
        setMicrophonePermission(request.permissions.microphonePermission);
        setLocationPermission(request.permissions.locationPermission);
      }
    });
  } catch (e) {
    console.log("Cannot fetch permission from background.js", e);
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "requestTransfer") {
      console.log(
        "Request Count is:",
        request.data.requestCount,
        request.data.activeTab
      );

      setActiveTab(request.data.activeTab);
      setAllRequestCount(request.data.requestCount[request.data.activeTab]);
      setTotalRequests(
        Object.values(request.data.requestCount[request.data.activeTab]).reduce(
          (a, b) => a + b,
          0
        )
      );
    }
  });
  return (
    <div>
      <h3>Permissions</h3>
      <div>
        <button
          className={
            cameraPermission == "granted"
              ? "permission-btn-state-granted"
              : cameraPermission == "denied"
              ? "permission-btn-state-denied"
              : "permission-btn-state-default"
          }
        >
          Camera
        </button>
        <button
          className={
            microphonePermission == "granted"
              ? "permission-btn-state-granted"
              : microphonePermission == "denied"
              ? "permission-btn-state-denied"
              : "permission-btn-state-default"
          }
        >
          Microphone
        </button>
        <button
          className={
            locationPermission == "granted"
              ? "permission-btn-state-granted"
              : locationPermission == "denied"
              ? "permission-btn-state-denied"
              : "permission-btn-state-default"
          }
        >
          Location
        </button>
      </div>
      <br />
      <span>{`Camera : ${cameraPermission}`}</span>
      <span>{`Microphone : ${microphonePermission}`}</span>
      <span>{`Location : ${locationPermission}`}</span>
      <br />

      <div>
        <h3>Background Communication Statics</h3>
        <p>{`Total Requests:${
          totalRequests == undefined ? 0 : totalRequests
        }`}</p>
        <br />
        <br />
        <Bar data={data} options={options} />
      </div>
      
      <h2>Cookies</h2>
      <strong>Count<span id="cookie-counter"></span></strong>
      <button id='clear-all-cookie-btn'>Clear All</button>
      <button id='hide-table-btn'>Show/Hide</button>

      <div>
        Enter Domain: <input type="text" id="inputDomain" name="domainname"/>
        <button id='delete-cookie-btn'>Delete</button>
      </div>

      
     
        <h2>Filter Cookies</h2>

       <button id='analytics-cookies'>Analytics/Marketing</button>
       <button id='tracking-cookies'>Information/Tracking</button>



       <div id="tablearea">
      </div>
       

  
{/* 
      <div>
      <table id="cookies-view-table">
        <thead id="table-header">
              <tr>
                  <th>Domain</th>
                  <th>Name</th>
                  <th>Secure</th>
                  <th>Value</th>
              </tr>
              
       </thead>
   <tbody>

  </tbody>
  </table>
  </div> */}
  <p id="message"></p>

      
      
      
    </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
render(<App />, root);

//method
//tabid
//type
//
