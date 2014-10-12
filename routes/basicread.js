/*
 * Load custom node-opcua module
 */
var opcua = require('./../models/opcua.js');

/*
 * execute a code
 */
opcua.dir();


/*
 * GET opcua test page.
 */
exports.index = function(req, res){
  res.render('basicRead', { title: 'BasicRead' });
};
