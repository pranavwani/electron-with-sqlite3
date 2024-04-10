import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from 'electron'
import path from "path"
import EventEmitter from "events"
const emitter = new EventEmitter()

const trays: Tray[] = []
let win: BrowserWindow

const createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.webContents.openDevTools()

    win.loadFile('public/index.html')

    win.maximize()

    emitter.on('log', (...args) => win.webContents.send('log', args))
}

app.whenReady().then(async () => {
    ipcMain.handle('ping', () => 'pong')

    ipcMain.on('set-custom-tray-icon', (event, index) => {
        setCustomTrayIcon(index)
    })

    ipcMain.on('create-tray', (event) => {
        createTray(trays.length)
    })

    // Example: Create two trays with different icons
    createTray(trays.length);

    createWindow()

    await require('./db')
})

// Function to open a file picker dialog and set the selected image as the tray icon
function setCustomTrayIcon(trayIndex: number) {
    dialog.showOpenDialog({ 
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }] 
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const selectedIconPath = result.filePaths[0];
            if (trayIndex >= 0 && trayIndex < trays.length) {
                trays[trayIndex].setImage(selectedIconPath);
            }
        }
    }).catch(err => {
        console.error('Error selecting file:', err);
    });
}

// Function to create a new tray with a specified icon
function createTray(index: number) {
    const tray = new Tray(path.join(__dirname, '../public/icons/fire.png'));
    trays.push(tray);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Option 1', click: () => console.log('Option 1 clicked') },
        { label: 'Option 2', click: () => console.log('Option 2 clicked') },
        { label: 'Set Custom Icon', click: () => setCustomTrayIcon(index) }
    ]);
    tray.displayBalloon({ title: 'Copied',content: 'Copied to clipboard' });   


    tray.setToolTip('My Custom Tray');
    tray.setContextMenu(contextMenu);
}

export { emitter }