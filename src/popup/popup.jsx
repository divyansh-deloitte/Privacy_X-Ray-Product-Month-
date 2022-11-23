import React,{useEffect,useState} from 'react'
import { render } from 'react-dom'
import './popup.css'

const App= () => {
  
  //************************************************************///

   var count = 0;
   var clear_flag=false;


   function convertTimestamp(timeStamp){

    return new Date(timeStamp).toDateString();
    //  var dateFormat= new Date(timeStamp);
    //  return dateFormat.getDate()+
    //  "/"+(dateFormat.getMonth()+1)+
    //  "/"+dateFormat.getFullYear()+
    //  " "+dateFormat.getHours()+
    //  ":"+dateFormat.getMinutes()+
    //  ":"+dateFormat.getSeconds();
   }
   
 
   function clearTable(){
    let tablearea = document.getElementById("tablearea");
    let table = document.getElementById("cookies-view-table");
    table.remove();
    view_count = 0;
    document.getElementById("message").innerHTML = "all cookies cleared!!!";
    clear_flag = true;
    // document.getElementById("hide-table-btn").disabled=true;
   }

   function setCookieCount(){
    chrome.cookies.getAll({},function(cookies){
        count=cookies.length;
        console.log(count)
        console.log("hi fromm cookies")
        document.getElementById("cookie-counter").innerHTML = count;
    });
   
    }
    // setCookieCount();

    function clearAllCookies(){
      console.log("cookies cleared");
      chrome.cookies.getAll({}, function(cookies) {
      console.log(cookies[0])
          for (var i in cookies) {
            removeCookie(cookies[i]);
          }
        });
        count = 0
        document.getElementById("cookie-counter").innerHTML = count;
        clearTable(); 
    }
    
    function removeCookie(cookie) {

      var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
                cookie.path;
      console.log(url);
      chrome.cookies.remove({"url": url, "name": cookie.name});
    }

    var view_count = 0;

    
    function populateTable(){
      var tablearea = document.getElementById('tablearea'),
        table = document.createElement('table');
        table.id = "cookies-view-table";
      
      if(clear_flag){
        document.getElementById("message").innerHTML = "No Cookies Found!!!";
      }
      if(view_count == 0){
        

        var tr = document.createElement('tr');
        tr.appendChild( document.createElement('th') );
        tr.appendChild( document.createElement('th') );
        tr.appendChild(document.createElement('th') );
        tr.appendChild( document.createElement('th') );
        tr.appendChild(document.createElement('th') );


    tr.cells[0].appendChild( document.createTextNode('Website') );
    tr.cells[1].appendChild( document.createTextNode('HttpOnly') );
    tr.cells[2].appendChild( document.createTextNode('Secure') );
    tr.cells[3].appendChild( document.createTextNode('Expiration Date') );
    tr.cells[4].appendChild( document.createTextNode('Remove') );

    table.appendChild(tr);

    chrome.cookies.getAll({}, function(cookies) {
      for (var i in cookies) {

        var tr = document.createElement('tr');

        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
        tr.appendChild(document.createElement('td') );
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );

        var button = document.createElement('button'); 
        var bText = document.createTextNode('X');  
        button.appendChild(bText);
        // button.onclick = deleteraw
        button.className = "delete-btn";
        button.id = "btnid"+ i;
        button.style.background="rgba(100,13,243,0.6)";

        var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain +
                cookies[i].path;
        tr.cells[0].appendChild( document.createTextNode(url) );
        tr.cells[1].appendChild( document.createTextNode(cookies[i].httpOnly ? "X":"") );
        tr.cells[2].appendChild( document.createTextNode(cookies[i].secure ? "X":"") );
        tr.cells[3].appendChild( document.createTextNode(cookies[i].expirationDate ? convertTimestamp(cookies[i].expirationDate*1000):"Session") );
        tr.cells[4].appendChild(button); 

        table.appendChild(tr);
      }
     
    }); 
    view_count = view_count + 1;
    tablearea.appendChild(table);
      }
      else{
        // let tablearea = document.getElementById("cookies-view-table");
        if (tablearea.style.display === "none") {
          tablearea.style.display = "block";
          } else { 
            tablearea.style.display = "none";
          }
      }
}

    
    
    function hideTable(){
      if(clear_flag){
        document.getElementById("message").innerHTML = "No Cookies Found!!!";
      }
      if(view_count==0){
        let table = document.getElementById("cookies-view-table");
        chrome.cookies.getAll({}, function(cookies) {
          for (var i in cookies) {
            let tr = table.insertRow();
            tr.insertCell().textContent = cookies[i].domain;

            tr.insertCell().textContent = cookies[i].name;

            tr.insertCell().textContent = cookies[i].secure;
            tr.insertCell().textContent = cookies[i].value;

          }
        });   
        view_count = view_count + 1;
      }
      else{
        let x = document.getElementById('tablearea')
      if (x.style.display === "none") {
        x.style.display = "block";
        } else { 
        x.style.display = "none";
        }
      }
     
    }

    function RemoveFromTable(tblID, VALUE){
      
 }
    
    
    function deleteCookie(domainname)  
    {
      // var new_count = 0;
      // chrome.cookies.getAll({}, function(cookies) {
      //   console.log(cookies[0])
      //       for (var i in cookies) {
      //         if (domainname === cookies[i].domain)
      //         {
      //           // delete_count = delete_count + 1;
      //           removeCookie(cookies[i]);
      //         }
             
      //       }

      //     });
      var delete_count = 0;
         chrome.cookies.getAll(
            {"domain":domainname}, function(domaincookies){
              delete_count = domaincookies.length;
              for (var i in domaincookies) {
                console.log(domaincookies[i].domain +"cookies is going for delete")

                removeCookie(domaincookies[i]);
                // let tableid = document.getElementById("cookies-view-table");
                // RemoveFromTable(tableid, domaincookies[i].domain)

              }
              console.log(count);
              console.log(delete_count);
              console.log(count-delete_count);
              document.getElementById("cookie-counter").innerHTML = count-delete_count;
            }
          );
    }
 

    // function toggle(){
    //   let table = document.getElementById("cookies-view-table");
    //   if (table.style.display === "none") {
    //     table.style.display = "block";
    //     } else { 
    //     table.style.display = "none";
    //     }
    // }
    const analytics_cookies_name_list = ['_ga',
    '_gads',
    '_gac_',
    '_gcl_',
    '_gat_UA-16516162-1',
    '_gcl_au',
    '_gid']

    const tracking_cookies_name_list = [
      'NID',
      'ENID',
      '1p_jar',
      'visitor_id*',
      'visitor_id311061-hash',
      'CGIC',
      'UULE',
      'DSID',
      'pm_sess',
      'VISITOR_INFO1_LIVE',
      'GPS',
      'PREF',
      'UIDR'

    ]

    function filterbyname(name){
      chrome.cookies.getAll(
        {"name":name}, function(filteredcookies){
          console.log(`${name}:${filteredcookies.length}`)
          if(filteredcookies.length>0){
            for (var i in filteredcookies) {
              console.log(filteredcookies[i])
            }
          }
          else{
            console.log(`No cookies found with name:${name}`)
          }
          console.log(filteredcookies)
        }
      );
    }

    function filter(types){
      var aList = [];
      if(types == "analytics"){
        aList = analytics_cookies_name_list;
        console.log(aList);
      }
      else if(types == "tracking"){
        aList = tracking_cookies_name_list;
      }
        for(var i in aList){
          var name = aList[i];
          console.log(name);
          filterbyname(name);
        }


    }

    document.addEventListener('DOMContentLoaded', function() {
      
      var clear_Cookies = document.getElementById("clear-all-cookie-btn");
      var delete_Cookie = document.getElementById("delete-cookie-btn");
      var hide_table = document.getElementById("hide-table-btn");

      var analytics = document.getElementById("analytics-cookies");
      var tracking = document.getElementById("tracking-cookies");

     
      // onClick's logic below:
      clear_Cookies.addEventListener('click', function() {
          clearAllCookies();
      });

    //   view_Coockies.addEventListener('click', function() {
    //       viewAllCookies();
    // });

    hide_table.addEventListener('click', function() {
         populateTable();
     });

     delete_Cookie.addEventListener('click', function() {
        var domain = document.getElementById('inputDomain').value;
        console.log(domain.split("//")[1])

        console.log(domain.split("//")[1]);
        deleteCookie(domain.split("//")[1]);
  });

  analytics.addEventListener('click', function() {

    filter('analytics');
  });  
  
  tracking.addEventListener('click', function() {
    filter('tracking');
  });



  });






  //************************************************************///

  const [ cameraPermission, setCameraPermission ] = useState("");
  const [ microphonePermission, setMicrophonePermission ] = useState("");
  const [ locationPermission, setLocationPermission ] = useState("");
  // const [ cookieCount, setCookieCount ] = useState(0);
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

      //**** */
      setCookieCount();
      //**** */
      

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
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
