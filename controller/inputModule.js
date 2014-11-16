/**
 * Hand Module Controller
 */

function index(req, res) {
  var jadeData = new Object;

  var interface = require('./../models/simpleModuleInterface');
  interface.getInput(function(err, mi5object) {
    if (err) {
      console.log('ERR - Error in inputModule', err);
      return 0;
    }
    jadeData.input = mi5object;
    console.log(JSON.stringify(jadeData, null, 1));
    res.render('sbadmin2/input_module_index', jadeData);
  })

}
exports.index = index;