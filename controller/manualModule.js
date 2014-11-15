/**
 * Hand Module Controller
 */

function showModule(req, res) {
  var jadeData = new Object;

  var manualModuleId = 2401;
  mManualModule.getModuleData(manualModuleId, function(err, mi5Data, rawData) {
    if (err) {
      console.log(err);
      return 0;
    }

    jadeData.manualModule = mi5Data;
    // console.log(JSON.stringify(mi5Data, null, 1));

    mManualModule.subscribeModuleData(rawData);

    res.render('sbadmin2/manual_module_2401', jadeData);
  });
}
exports.showModule = showModule;
