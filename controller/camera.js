/**
 * Overview with charts Router
 */

function index(req, res) {
  var jadeData = new Object;

  io.on('connection', function(socket) {
    socket.join('camera');
  }); // io.on

  setInterval(function() {
    io.to('camera').emit('cameraNew');
  }, 15 * 1000); // setInterval

  mi5Camera.getFileList(function(list) {
    jadeData.camera = mi5Camera.getLastPictures(5);
    res.render('sbadmin2/camera', jadeData);
  });
}
exports.index = index;