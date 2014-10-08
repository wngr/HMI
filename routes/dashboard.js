
/*
 * GET users listing.
 */

exports.index = function(req, res){
  res.render('dashBoard', { title: "Dashboard Design Tests"});
};

exports.module = function(req, res){
  res.render('dashboard/module');
};