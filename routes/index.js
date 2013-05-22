/*
 * GET home page.
 */

var exec = require('child_process').exec,
  fs = require('fs'),
  child;

exports.index = function(req, res) {
  res.render('index', {
    title: 'Express'
  });
};

exports.bives = function(req, res) {
  fs.unlink('first.xml', function(err) {
    if (err) throw err;
    console.log('successfully deleted /tmp/hello');
  });
  fs.unlink('second.xml', function(err) {
    if (err) throw err;
    console.log('successfully deleted /tmp/hello');
  });
  fs.writeFile("first.xml", req.body.first, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  fs.writeFile("second.xml", req.body.second, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
  //var command = 'java -cp BiVeS-1.1.jar de.unirostock.sems.bives.api.SBMLDiff first.xml second.xml';
  var command = 'java -cp BiVeS-1.1.jar de.unirostock.sems.bives.api.SBMLDiff first.xml second.xml';

  child = exec(command, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.send(stdout);
    res.send(200);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
};
