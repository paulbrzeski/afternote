// In renderer process (web page).
const {ipcRenderer} = require('electron')
let notebooks = ipcRenderer.sendSync('client-event', 'ready');
for (var bookname in notebooks) {
  
  $(buildNoteList(bookname, notebooks[bookname])).appendTo('#notes');
}
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')

function buildNoteList (bookname, books) {
  let $list = $("<div/>", {
  	class: 'ui relaxed link list',
  	'data-bookname': bookname
  });
  for (var book in books) {
  	$('<div/>', {
  	  class: 'item',
	  html: $('<a/>', {
	  	class: 'content',
	  	href: '#',
	  	onclick: 'loadNote("' + books[book].filename + '");',
	  	text: book
	  })
	}).appendTo($list);
  }

  return $list;
}

function loadNote (filename) {
  $('#active').html(ipcRenderer.sendSync('load', filename));
}