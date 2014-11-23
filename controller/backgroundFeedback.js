/**
 * Feedback Class
 * 
 */
var fs = require('fs');
var moment = require('moment');
var feedbackFile = './feedback.txt';

function preLog() {
  return 'Feedback-Module'.bgMagenta;
}

function sockets(socket) {
  socket.on('feedBack', function(data) {
    data.push({
      name : 'timestamp',
      value : moment().format()
    });
    console.log(preLog(), ' received event. Rating: ', data[0].value);
    data = JSON.stringify(data);

    fs.appendFile(feedbackFile, data + "\n", function(err) {
      if (err) {
        console.log(preLog(), err);
      } else {
        console.log(preLog(), ' saved.');
      }
    });
  }); // end socket.on
}
exports.sockets = sockets;