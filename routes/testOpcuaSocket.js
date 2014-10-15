/**
 * Control to test the opcua socket model
 */

opcuaSocket = require('./../models/opcuaSocket');



exports.index = function(req, res){
  res.render('bootstrap/socket');
};