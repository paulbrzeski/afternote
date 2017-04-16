/*
  Evernote Import script for scriptomente
  Usage: node import.js <filename.enex>
*/
const fs = require('fs'),
      path      = require('path'),
      XmlStream = require('xml-stream');

let filename = process.argv[2];
var stream = fs.createReadStream(filename);
var xml = new XmlStream(stream);
xml.on('updateElement: note', function(note) {
  console.log(note);
  die();
});
xml.on('error', function(message) {
  console.log('Parsing as ' + ('auto') + ' failed: ' + message);
});
xml.on('data', function(data) {
  //process.stdout.write(data);
});