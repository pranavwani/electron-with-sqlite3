import { workerData, parentPort } from 'worker_threads'
import sqlite3, { verbose } from 'sqlite3';
verbose();
const db = new sqlite3.Database('./posts1.db');
db.configure('busyTimeout', 10000)

db.serialize(() => {
  db.run('BEGIN TRANSACTION;');
  db.run(
    'CREATE TABLE IF NOT EXISTS posts (userId INTEGER, id INTEGER PRIMARY KEY, title VARCHAR(200), body TEXT)'
  );
  
  const { records } = workerData;
  
  const stmt = db.prepare('INSERT INTO posts (userId, id, title, body) VALUES (?, ?, ?, ?)');

  try {
    // Execute multiple insertions within a single transaction
    records.forEach((record: { userId: any; id: any; title: any; body: any }) => {
      stmt.run(record.userId, record.id, record.title, record.body);
    });
    
    // Finalize the prepared statement
    stmt.finalize();

    // Commit the transaction
    db.run('COMMIT;');
  } catch (error) {
    // Rollback the transaction in case of an error
    console.error('Error inserting records:', error);
    db.run('ROLLBACK;');
  }
});


// Close the database connection
db.close();

// Inform the main process that processing is complete
parentPort?.postMessage('done');
