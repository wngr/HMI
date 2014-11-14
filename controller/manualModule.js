/**
 * Hand Module Controller
 */

function showModule(req, res) {
  var jadeData = new Object;
  var interface = require('./../models/simpleManualModule');

  interface.getModuleData(2401, function(err, mi5Data, rawData) {
    if (err) {
      console.log(err);
      return 0;
    }

    jadeData.manualModule = mi5Data;

    interface.subscribeModuleData(rawData);

    res.render('bootstrap/testManualModuleView', jadeData);
  });
}
exports.showModule = showModule;
