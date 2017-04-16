/*
  Evernote Import script for scriptomente
  Usage: node import.js <filename.enex>
*/
const fs = require('fs'),
      path      = require('path'),
      toMarkdown = require('to-markdown'),
      XmlStream = require('xml-stream');

function formatNoteContent (note) {
  return (note.substring(
    note.indexOf("<en-note>") + "<en-note>".length,
    note.indexOf("</en-note>")
  ));
}

let filename = process.argv[2];
var stream = fs.createReadStream(filename);
var xml = new XmlStream(stream);
xml.on('updateElement: note', function(note) {
  var mapping = {
    name: note.title,
    data: formatNoteContent(note.content),
    original_created: note.created,
    original_updated: note.updated
  }
  console.log(mapping);
  for (var keyname in note) {
    console.log(keyname);
  }
  //console.log(note);
  die();
});

// // Debug
// xml.on('error', function(message) {
//   console.log('Parsing as ' + ('auto') + ' failed: ' + message);
// });
// xml.on('data', function(data) {
//   //process.stdout.write(data);
// });