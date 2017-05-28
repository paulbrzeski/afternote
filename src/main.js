// In renderer process (web page).
const {ipcRenderer} = require('electron')
let notebooks = ipcRenderer.sendSync('client-event', 'ready');
buildNotebookList(notebooks);

$('.ui.sticky > div').sticky({
  context: '.ui.padded.grid'
});
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')

function buildNotebookList (notebooks) {
  let $list = $("<div/>", {
    class: 'ui vertical inverted menu overlay visible fixed sticky'
  });

  let firstLoaded = false;
  for (var bookname in notebooks) {
    let $link = $('<a/>', {
      'data-bookname': bookname,
      href: '#',
      style: 'text-transform: capitalize',
      html: $('<a/>', {
        class: 'item',
        html: bookname + '<i class="edit icon right floated"></i>'
      })
    });
    $link.click(clickHandler);
    $list.append($('<div/>', {
      html: $link
    }));

    if (!firstLoaded) {
      buildNoteList(bookname, notebooks[bookname]);
      firstLoaded = true;
    }
  }
  $list.appendTo('#notebooks');
  $('.ui.sticky').sticky({
    context: '#context'
  })
}

function clickHandler(e) {
  let bookname = $(this).data('bookname');
  buildNoteList(bookname, notebooks[bookname]);
}

function buildNoteList (bookname, books) {
  let $list = $("<div/>", {
  	class: 'ui relaxed link list',
  	'data-bookname': bookname
  });
  let firstLoaded = false;
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

    if (!firstLoaded) {
      loadNote(books[book].filename);
      firstLoaded = true;
    }
  }
  
  $('#notes').html($list);
  $('.ui.sticky')
    .sticky('refresh')
  ;
}

function loadNote (filename) {
  $('#active').html(ipcRenderer.sendSync('load', filename));
  $('.ui.sticky > div').sticky('refresh');
}