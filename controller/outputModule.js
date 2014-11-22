/**
 * Input Module Controller
 */

function index(req, res) {
  var jadeData = new Object;

  mi5Output.getModuleData(function(err) {
    if (err) {
      console.log(err);
    }

    // console.log(mi5Manual.jadeData);

    var outputSockets = _.once(mi5Output.ioRegister);
    io.on('connection', function(socket) {
      socket.join('output-module');
      outputSockets(socket);
    });

    jadeData.module = mi5Output.jadeData;

    // console.log(JSON.stringify(jadeData, null, 1));
    // console.log(mi5Input.jadeData.SkillOutput[0].Busy);

    res.render('sbadmin2/output_module', jadeData);
  });

}
exports.index = index;