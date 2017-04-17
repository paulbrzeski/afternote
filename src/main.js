// In renderer process (web page).
const {ipcRenderer} = require('electron')
let notebooks = ipcRenderer.sendSync('client-event', 'ready');
$('<ul/>', {id: 'notebook_list'}).appendTo('#container');
for (var stacks in notebooks) {
  $('<li/>', {
  	text: stacks.toUpperCase()
  }).appendTo('#notebook_list');
}
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')