/**
 * Hand Module Controller
 */

function showModule(req, res) {
  MaintenanceModuleActivated = 1;
  var jadeData = new Object;
  jadeData.title = 'Maintenance Module';

  mMaintenanceModule.getModuleData(function(err, mi5Data, rawData) {
    if (err) {
      console.log(err);
      return 0;
    }

    jadeData.manualModule = mi5Data;
    // console.log(JSON.stringify(mi5Data, null, 1));

    mMaintenanceModule.subscribeModuleData(rawData);

    res.render('sbadmin2/maintenance_module', jadeData);
  });
}
exports.showModule = showModule;
