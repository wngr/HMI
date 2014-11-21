/**
 * Hand Module Controller
 */

function showModule(req, res) {
  var jadeData = new Object;
  jadeData.title = 'Manual Module';

  // console.log(jadeData);

  mi5Manual.getModuleData(function(err) {
    if (err) {
      console.log(err);
    }

    console.log(mi5Manual.jadeData);

    var manualSockets = _.once(mi5Manual.ioRegister);
    io.on('connection', function(socket) {
      socket.join('manual-module');
      manualSockets(socket);
    });

    jadeData.manualModule = mi5Manual.jadeData;

    res.render('sbadmin2/maintenance_module', jadeData);
  });
}
exports.showModule = showModule;