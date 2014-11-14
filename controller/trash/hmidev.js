
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('hmiDev', { title: 'Project MI5 - HMI Development Environment' });
};