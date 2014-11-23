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

  this.updateInterval = 1000;

  this.ftp = new JSFtp({
    host : CONFIG.FTPCamera,
    port : 21,
    user : 'mi5',
    pass : 'Parkring$4'
  });
};
exports.newMi5Camera = new module();

function preLog() {
  return 'Camera-Module'.bgBlue;
}

/**
 * Get all .bmp files in the home directory
 * 
 * @param callback(fileList)
 */
module.prototype.getFileList = function(callback) {
  var self = this;

  var tempList = [];

  self.ftp.ls('.', function(err, res) {
    res.forEach(function(file) {
      var extension = file.name.slice(-4);
      if (extension == '.bmp') {
        var url = self.addBaseUrl(file.name)
        var id = md5(url);

        tempList.push({
          url : url,
          id : id,
          name : file.name,
          timestamp : file.name
        });
      }
    });
    self.fileList = tempList;
    callback(tempList);
  });
};

/**
 * Get newest n pictures (sort newest first);
 * 
 * @param n
 * @returns
 */
module.prototype.getLastPictures = function(n) {
  var self = this;

  assert(typeof n === 'number', 'specify the number of pictures you want to displya');

  var list = _.last(self.fileList, n);
  list.reverse();
  return list;
};

module.prototype.addBaseUrl = function(image) {
  var self = this;

  return self.baseUrl + image;
}

/**
 * 
 * @returns
 */
module.prototype.getLastPicture = function() {
  var self = this;
  return _.last(self.fileList);
};
