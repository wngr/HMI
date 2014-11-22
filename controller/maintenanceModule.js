/**
 * Maintenance Module Controller
 */

function showModule(req, res) {
  var jadeData = new Object;
  jadeData.title = 'Maintenance Module';

  // console.log(jadeData);

  mi5Maintenance.getModuleData(function(err) {
    if (err) {
      console.log(err);
    }

    // console.log(mi5Maintenance.jadeData);

    var maintenanceSockets = _.once(mi5Maintenance.ioRegister);
    io.on('connection', function(socket) {
      socket.join('maintenance-module');
      maintenanceSockets(socket);

      socket.on('disconnect', function() {
        console.log('disconnect in maintenance'.inverse, socket);
        console.log('connected sockets:'.inverse, io.sockets.connected);
      })
    });

    jadeData.manualModule = mi5Maintenance.jadeData;

    res.render('sbadmin2/maintenance_module', jadeData);
  });
}
exports.showModule = showModule;
