/**
 * FTP Module to connect to Wenglor Camera
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * @author Thomas Frei
 * @date 2014-11-22
 */
var JSFtp = require('jsftp');
var assert = require('assert');

/**
 * InputModule Class
 * 
 * old name module, for not changing everything
 * 
 * @returns
 */
module = function() {
  this.NumberOfSkillInputs = 2; // 15 max, but only 2 needed!
  this.NumberOfParameterInputs = 1; // 5 max

  this.ftp = new JSFtp({
    host : CONFIG.FTPCamera,
    port : 21,
    user : 'ftpuser',
    pass : 'Parkring$4'
  });
};
exports.newMi5Camera = new module();

/**
 * Get all .bmp files in the home directory
 * 
 * @param callback
 */
module.prototype.ftplist = function(callback) {
  var self = this;

  var templist = [];

  self.ftp.ls('.', function(err, res) {
    res.forEach(function(file) {
      var extension = file.name.slice(-4);
      if (extension == '.bmp') {
        console.log(file.name);
      }
    });
    callback();
  });
};

function getFileExtension(name) {

}