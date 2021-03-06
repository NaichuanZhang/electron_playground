// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const electron = require('electron')
// Module to control application life.
const app = electron.app
const path = require('path')
const Chart = require('chart.js')
var ctx = document.getElementById("myChart");
var fs = require('fs')
var parsed_event
var parsed_array=[]
var parsed_array_item=[]
var pathname = path.join(__dirname, 'eventlog.json')
var exists = fs.existsSync(pathname)

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
parsed_array=[]
parsed_array_item=[]
if(exists){
  //Read the file
  var element = fs.readFileSync(pathname,'utf8')
  parsed_event = JSON.parse(element)
  //console.log(parsed_event)
}else{
  console.log('No events')
  parsed_event={}
}
for (piece in parsed_event){
  parsed_array.push(piece)
}
var i=0
var date_count=0
var time_array=[]
for(i = 0; i<parsed_array.length;i++){
  if(i == 0){
    parsed_array_item.push(1)
    time_array.push(parsed_array[i].substring(0,10))
    date_count = 0
  }else{
    if(parsed_array[i].substring(0,10) == parsed_array[i-1].substring(0,10)){
      parsed_array_item[date_count] += 1
      console.log(parsed_array_item)
    }else{
      date_count ++
      parsed_array_item.push(1)
      time_array.push(parsed_array[i].substring(0,10))
    }
  }

}
console.log(parsed_array_item)
console.log(parsed_array)
/*
var time_array = []
var count
for(count = 0; count < parsed_array.length; count++){
  time_array.push(parsed_array[count])
  console.log(parsed_array.length)
}
*/
console.log("time")
console.log(time_array)
// graph the chart
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: time_array,
        datasets: [{
            label: 'task accomplished',
            data: parsed_array_item,
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
})




setInterval(function () {
  exists = fs.existsSync(pathname)
  if(exists){
    //Read the file
    console.log('Loding data')
    var element = fs.readFileSync(pathname,'utf8')
    //console.log(element)
    parsed_event = JSON.parse(element)
    var pretty_json = JSON.stringify(parsed_event, null, 2)
    //console.log(parsed_event)
    document.getElementById('event_showcase').innerHTML = (pretty_json.replace(/"|{|}/g,"")).replace(/,/g, "<br>")// render the data in the html div
  }else{
    console.log('No events')
    parsed_event={}
  }
}, 1000);






const logBtn = document.getElementById('eventlog')
//Write JSON data -- temp database
logBtn.addEventListener('click',function(event){
    if(exists){
      //Read the file
      console.log('Loding data')
      var element = fs.readFileSync(pathname,'utf8')
      parsed_event = JSON.parse(element)
      var pretty_json = JSON.stringify(parsed_event, null, 2)
      console.log(parsed_event)
      document.getElementById('event_showcase').innerHTML = pretty_json// render the data in the html div
      alert(pretty_json.replace(/"|{|}/g,""))
    }else{
      console.log('No events')
      parsed_event={}
    }
})
