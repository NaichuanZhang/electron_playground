// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Chart = require('chart.js')
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});



//notification and tray
const ipc = require('electron').ipcRenderer
let trayOn = false
if(!trayOn){
  ipc.send('put-in-tray')
  trayOn = true
}
ipc.on('tray-removed', function () {
  ipc.send('remove-tray')
  trayOn = false
})
/*
const trayBtn = document.getElementById('put-in-tray')
let trayOn = false

trayBtn.addEventListener('click', function (event) {
  if (trayOn) {
    trayOn = false
    document.getElementById('tray-countdown').innerHTML = ''
    ipc.send('remove-tray')
  } else {
    trayOn = true
    const message = 'Click demo again to remove.'
    document.getElementById('tray-countdown').innerHTML = message
    ipc.send('put-in-tray')
  }
})
// Tray removed from context menu on icon
ipc.on('tray-removed', function () {
  ipc.send('remove-tray')
  trayOn = false
  document.getElementById('tray-countdown').innerHTML = ''
})
*/
const trayBtn = document.getElementById('put-in-tray')
trayBtn.addEventListener('click', function (event) {
  // Do this from the renderer process
var notif = new window.Notification('Event Logger',
{
  body: "System is logging this event"
})
// If the user clicks in the Notifications Center, show the app
notif.onclick = function () {
  ipcRenderer.send('focusWindow', 'mainWindow')
}
})



//Read JSON data -- temp database
var fs = require('fs')
var exists = fs.existsSync('eventlog.json')
var parsed_event
setInterval(function () {
  if(exists){
    //Read the file
    console.log('Loding data')
    var element = fs.readFileSync('eventlog.json','utf8')
    parsed_event = JSON.parse(element)
    console.log(parsed_event)
    document.getElementById('event_showcase').innerHTML = element // render the data in the html div
  }else{
    console.log('No events')
    parsed_event={}
  }
}, 1000);




var event_element = 'Second Event' // for testing purposes  --TODO use document.getElementbyId to get event information.
const logBtn = document.getElementById('eventlog')
//Write JSON data -- temp database
logBtn.addEventListener('click',function(event){
  var d = new Date();
  var n = d.toJSON();
  var date = n
  var event_name = event_element
  parsed_event[date] = event_name
  var json = JSON.stringify(parsed_event, null, 2)
  fs.writeFile('eventlog.json', json, 'utf8', finished)
  function finished(err) {
    console.log('Finished writing additional.json');
    // Don't send anything back until everything is done
    var notif = new window.Notification('Event Logger',
    {
      body: "System has logged this event!"
    })
  }
  console.log("new event is logged")
})
