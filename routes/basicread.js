
/*
 * Load custom node-opcua module
 */
//var opcuaUtil = require('./../models/opcuaUtil.js');
//var opcua = require('./../models/opcua.js');

/*
 * execute a code
 */
//opcua.dir();
//opcuaUtil.initialze();


/*
 * modeltest
 */
//var modeltest = require('./../models/modeltest.js');


/*
 * GET opcua test page.
 */
exports.index = function(req, res){
  res.render('basicRead', { title: 'BasicRead' });
};
