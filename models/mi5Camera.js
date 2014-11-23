/**
 * FTP Module to connect to Wenglor Camera
 * 
 * We need GLOBAL.CONFIG = require('./config.js');
 * 
 * The FTP Home Dir corresponds with the htdcos/wenglor directory of the xampp server. With this setup, we can browse
 * the directory and then display it.
 * 
 * @author Thomas Frei
 * @date 2014-11-22
 */
var JSFtp = require('jsftp');
var assert = require('assert');

module = function() {
  this.fileList = [];

  // We use a xampp server on the HMI computer with port 8080, to not conflict with the node.js Server
  this.baseUrl = 'http://' + CONFIG.FTPCamera + ':8080/wenglor/';

  this.updateInterval = 3000;

  this.ftp = new JSFtp({
    host : CONFIG.FTPCamera,
    port : 21,
    user : 'mi5',
    pass : 'Parkring$4'
  });
};
exports.newMi5Camera = new module();

/**
 * Get all .bmp files in the home directory
 * 
 * @param callback
 */
module.prototype.updateFileList = function(callback) {
  var self = this;

  var tempList = [];

  self.ftp.ls('.', function(err, res) {
    res.forEach(function(file) {
      var extension = file.name.slice(-4);
      if (extension == '.bmp') {
        tempList.push(file.name);
      }
    });

    self.fileList = tempList;

    if (typeof callback === 'function') {
      callback();
    }
  });
};

module.prototype.subscribe = function() {
  var self = this;

  setInterval(self.checkForNew, self.updateInterval);
};

module.prototype.checkForNew = function(newFileList) {
  var self = this;

  self.updateFileList(function() {
    var newDiff = _.difference(newFileList, self.fileList);

    if (newDiff.length >= 1) {
      // io.emit('cameraNewImage', );
      console.log('New Image'.bgGreen);
    }
  });
};

module.prototype.addBaseUrl = function(image) {
  var self = this;

  return self.baseUrl + image;
};

module.prototype.getLastPicture = function(image) {

};