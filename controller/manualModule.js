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
    //console.log(JSON.stringify(mi5Data, null, 1));

    interface.subscribeModuleData(rawData);

    res.render('sbadmin2/manual_module', jadeData);
  });
}
exports.showModule = showModule;
