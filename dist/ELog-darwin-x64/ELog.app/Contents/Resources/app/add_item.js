const electron = require('electron')
// Module to control application life.
const app = electron.app
const path = require('path')
var pathname = path.join(__dirname, 'eventlog.json')
  var fs = require('fs')
  var exists = fs.existsSync(pathname)
  if(exists){
    //Read the file
    console.log('Loding data')
    var element = fs.readFileSync(pathname,'utf8')
    parsed_event = JSON.parse(element)
    console.log(parsed_event)
  }else{
    console.log('No events')
    parsed_event={}
  }

  const log = document.getElementById('eventlog')
  //Write JSON data -- temp database
  log.addEventListener('click',function(event){
    var event_element = document.getElementById('event_input').value
    console.log(event_element)
    var date = properDate()
    parsed_event[date] = event_element
    var json = JSON.stringify(parsed_event, null, 2)
    //var n = d.toJSON();
    /*
    var event_name = event_element
    var parsed_event_add ={};
    parsed_event_add["time"] = date
    parsed_event_add["events"] = event_element
    var json_add = JSON.stringify(parsed_event_add, null, 2)
    alert(json_add)
    var json = JSON.stringify(parsed_event, null, 2)
    //alert(json_add.substring(1, json_add.length))
    if (json == '{}'){
      json = json.substring(0, json.length-1) + json_add.substring(1, json_add.length)
    }else{
    json = json.substring(0, json.length-1) +','+ json_add.substring(1, json_add.length)
    }
    */
    fs.writeFile(pathname, json, 'utf8', finished)
    function finished(err) {
      console.log('Finished writing additional.json');
      // Don't send anything back until everything is done
      var notif = new window.Notification('Event Logger',
      {
        body: "System has logged this event!"
      })
    }
    console.log("new event is logged")
    setTimeout(function () {
      window.close()
      console.log(json)
    }, 100);
  })


  // get a proper date
  function properDate(){
  var d = new Date();
  var DayOfMonth = d.getDate();
  var DayOfWeek = d.getDay();
  var Month = d.getMonth();
  var Year = d.getFullYear();
  var Hours = d.getHours();
  var Minutes = d.getMinutes();
  var Seconds = d.getSeconds();

  switch (DayOfWeek) {
  case 0:
      day = "Sun";
      break;
  case 1:
      day = "Mon";
      break;
  case 2:
      day = "Tue";
      break;
  case 3:
      day = "Wed";
      break;
  case 4:
      day = "Thu";
      break;
  case 5:
      day = "Fri";
      break;
  case 6:
      day = "Sat";
      break;
  }

  switch (Month) {
  case 0:
      month = "Jan";
      break;
  case 1:
      month = "Feb";
      break;
  case 2:
      month = "Mar";
      break;
  case 3:
      month = "Apr";
      break;
  case 4:
      month = "May";
      break;
  case 5:
      month = "Jun";
      break;
  case 6:
      month = "Jul";
      break;
  case 7:
      month = "Aug";
      break;
  case 8:
      month = "Sep";
      break;
  case 9:
      month = "Oct";
      break;
  case 10:
      month = "Nov";
      break;
  case 11:
      month = "Dec";
      break;
  }
  var theDate = day + " " + month + " " + DayOfMonth + "  " + Year + " " + Hours + ":" + Minutes + ":" + Seconds;
  return theDate;
}
