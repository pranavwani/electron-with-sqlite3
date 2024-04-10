const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nfi', {
    ping: () => ipcRenderer.invoke('ping'),
    db: {
        openDB: (dbName: string) => ipcRenderer.send('open-db', dbName),
        createTable: (tableName: string) => ipcRenderer.send('create-table', tableName),
        createRecord: (tableName: string) => ipcRenderer.send('create-record', tableName),
        fetchRecords: async (tableName: string) => { return ipcRenderer.sendSync('fetch-all', tableName) },
        closeDB: () => ipcRenderer.send('close-db'),
        worker: () => {return ipcRenderer.sendSync('batch-insert')},
        check: (args: any) => {
            console.log(args);
        }
    },
    log: () => ipcRenderer.on('log', (event, args) => {
        console.log(args)
    }),
    greet:() =>{ alert('hi'); },
    test: (arg: any) => {
        console.log(arg);
        console.log(arg.greet())
        ipcRenderer.send('test', arg)
    },
    setTrayIcon: (index: number) => ipcRenderer.send('set-custom-tray-icon', index),
    createTray: () => ipcRenderer.send('create-tray')
})