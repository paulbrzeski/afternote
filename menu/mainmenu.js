const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Import from Evernote Export (.enex)'
      },
      {
        role: 'close'
      }
    ]
  },
  
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)