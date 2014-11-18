/**
 * Hand Module Controller
 */

function showModule(req, res) {
  ManualModuleActivated = 1;
  var jadeData = new Object;
  jadeData.title = 'Manual Module';

  var manualModuleId = 2403;
  mManualModule.getModuleData(function(err, mi5Data, rawData) {
    if (err) {
      console.log(err);
      return 0;
    }

    jadeData.manualModule = mi5Data;
    // console.log(JSON.stringify(mi5Data, null, 1));

    mManualModule.subscribeModuleData(rawData);

    res.render('sbadmin2/manual_module', jadeData);
  });
}
exports.showModule = showModule;
