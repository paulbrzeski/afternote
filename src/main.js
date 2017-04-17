// In renderer process (web page).
const {ipcRenderer} = require('electron')
let notebooks = ipcRenderer.sendSync('client-event', 'ready');
$('<ul/>', {id: 'notebook_list'}).appendTo('#container');
for (var bookname in notebooks) {
  $('<li/>', {
  	html: buildNoteList(bookname, notebooks[bookname])
  }).appendTo('#notebook_list');
}
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')

function buildNoteList (bookname, books) {

  let $list = $("<ul/>", {'data-bookname': bookname});
  for (var book in books) {
  	$('<li/>', {
	  text: book
	}).appendTo($list);
  }

  return 	$('<h2/>', {text: bookname.toUpperCase()}).prop('outerHTML') + 
  			$list.prop('outerHTML')
}