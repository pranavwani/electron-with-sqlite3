
import sqlite3 from "sqlite3";
import fs from "fs";
import {ipcMain} from "electron"
import path from "path"
import {Worker} from "worker_threads"
import posts1 from "./posts1.json"
import {emitter} from "./main"
import os from "os"
sqlite3.verbose();

const numCores = os.cpus().length;
let db: sqlite3.Database;
function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
ipcMain.on('open-db', (event, dbName) => {
    db = new sqlite3.Database(`${dbName}.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            emitter.emit('log', `Error opening the database: ${err.message}`);
        }
        else {
            emitter.emit('log', `Connected to the database: ${dbName}`);
        }
    });
});
ipcMain.on('create-table', (event, tableName) => {
    db.run(`CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)`);
    emitter.emit('log', `Table ${tableName} created successfully.`);
});
ipcMain.on('create-record', (event, tableName) => {
    const stmt = db.prepare(`INSERT INTO ${tableName} (content) VALUES (?)`);
    try {
        for (let i = 0; i < 10; i++) {
            stmt.run(generateRandomString(10));
        }
        stmt.finalize();
        emitter.emit('log', `record created successfully in table: ${tableName}`);
    }
    catch (e) {
        emitter.emit('log', `failed to create record in table: ${tableName}`, e);
    }
});
ipcMain.on('fetch-all', (event, tableName) => {
    console.log('called');
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        console.log(rows);
        if (err) {
            event.returnValue = err.message;
        }
        else {
            event.returnValue = rows;
        }
    });
});
ipcMain.on('close-db', () => {
    db.close();
    emitter.emit('log', 'db closed');
});
ipcMain.on('test', (event, arg) => {
    console.log(arg);
});
ipcMain.on('batch-insert', (event) => {
    console.time('asyncOperation');
    // Distribute records to worker threads for processing
    const numWorkers = numCores;
    const recordsPerWorker = Math.ceil(posts1.length / numWorkers);
    const workers = [];
    let recordsProcessed = 0;
    for (let i = 0; i < numWorkers; i++) {
        const startIdx = i * recordsPerWorker;
        const endIdx = Math.min((i + 1) * recordsPerWorker, posts1.length);
        const workerRecords = posts1.slice(startIdx, endIdx);
        console.log({ length: workerRecords.length});
        
        const worker = new Worker(path.join(__dirname, './worker.js'), { workerData: { records: workerRecords } });
        worker.on('message', (message) => {
            recordsProcessed++;
            if (recordsProcessed === numWorkers) {
                console.log('finished');
                // All worker threads have finished processing
                console.timeEnd('asyncOperation');
                event.returnValue = 'finished';
            }
        });
        workers.push(worker);
    }
    // console.time('asyncOperation2')
    // const db = new sqlite3.Database('./posts2.db')
    // // Insert records into the database
    // db.serialize(() => {
    //   db.run(
    //     'CREATE TABLE IF NOT EXISTS posts (userId INTEGER, id INTEGER PRIMARY KEY, title VARCHAR(200), body TEXT)'
    //   )
    //   const stmt = db.prepare('INSERT INTO posts (userId, id, title, body) VALUES (?, ?, ?, ?)')
    //   posts2.forEach((record: any) => {
    //     stmt.run([record.userId, record.id, record.title, record.body])
    //   })
    //   stmt.finalize()
    // })
    // // Close the database connection
    // db.close()
    // console.timeEnd('asyncOperation2')
    console.log('called');
    const filesToRemove = [
        path.join(__dirname, '../posts1.db'),
        // './posts2.db'
    ];
    filesToRemove.forEach(filePath => fs.unlink(filePath, (err) => {
        console.log(filePath);
        if (!err) {
            console.log('File deleted');
        }
        else
            console.log('errorrrr');
    }));
});
