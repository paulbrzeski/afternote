/*
  Evernote Import script for scriptomente
  Usage: node import.js <filename.enex>
*/
const fs = require('fs'),
      path      = require('path'),
      toMarkdown = require('to-markdown'),
      crypto    = require('crypto'),
      XmlStream = require('xml-stream');

function formatNoteContent (content) {
  return replaceMediaTags(content.substring(
    content.indexOf("<en-note>") + "<en-note>".length,
    content.indexOf("</en-note>")
  ));
}

function replaceMediaTags (content) {
  let pattern = /<en-media ([\s\S]*?)><\/en-media>/g;
  let match = pattern.exec(content);
  while (match != null) {
    let [original_element, raw_metadata] = match;
    raw_metadata = raw_metadata.split(' ');
    let metadata = {};

    for (var keyname in raw_metadata) {
      // note both ascii double quotes are here... hail satan.
      let parsed_metadata = raw_metadata[keyname].replace('"','').replace('"','').split('=');
      metadata[parsed_metadata[0]] = parsed_metadata[1];
    }
    if (resources[metadata.hash]) {
      let imageTag = '<img ';
      imageTag += 'width="' + metadata.width + '" ';
      imageTag += 'height="' + metadata.height + '" ';
      imageTag += 'alt="' + metadata.alt + '" ';
      imageTag += 'src="data:image/png;base64,' + resources[metadata.hash] + '" ';
      imageTag += " />";
      content = content.replace(original_element, imageTag);
    }

    // Continue the loop.
    match = pattern.exec(content);
  }
  return content;
}

let resources = {};
function processResources (raw_resources) {
  resources = {};
  //console.log(raw_resources);
  raw_resources.forEach(function(res){
    let hash;
    if (!res.recognition) {
      var buf = new Buffer(res.data.$text, 'base64');
      hash = crypto.createHash('md5')
        .update(buf, 'utf8')
        .digest('hex');
    }
    else {
      let rex = /objID="(.*?)"/g;  
      hash = res.recognition.match(rex)[0].replace('objID=','').replace('"','').replace('"','');
    }
    resources[hash] = res.data.$text;
  });
  return resources;
}

let filename = process.argv[2];
var stream = fs.createReadStream(filename);
var xml = new XmlStream(stream);
xml.collect('resource'); // Maps multiple 'resource' tags into array
xml.on('endElement: note', function(note) {
  var mapping = {
    name: note.title,
    resources: processResources(note.resource),
    data: formatNoteContent(note.content),
    original_created: note.created,
    original_updated: note.updated
  }
  console.log(mapping.data);
  die();
  
});

// // Debug
// xml.on('error', function(message) {
//   console.log('Parsing as ' + ('auto') + ' failed: ' + message);
// });
// xml.on('data', function(data) {
//   //process.stdout.write(data);
// });