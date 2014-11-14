exports.index = function(req, res){
  console.log('Request:', req);
  
  
  res.render('bootstrap/index');
};