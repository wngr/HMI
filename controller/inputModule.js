/**
 * Input Module Controller
 */

function index(req, res) {
  var jadeData = new Object;

  mi5Input.getModuleData(function(err) {
    if (err) {
      console.log(err);
    }

    // console.log(mi5Manual.jadeData);

    var inputSockets = _.once(mi5Input.ioRegister);
    io.on('connection', function(socket) {
      socket.join('input-module');
      inputSockets(socket);
    });

    jadeData.module = mi5Input.jadeData;

    // console.log(JSON.stringify(jadeData, null, 1));
    // console.log(mi5Input.jadeData.SkillOutput[0].Busy);

    res.render('sbadmin2/input_module', jadeData);
  });

}
exports.index = index;