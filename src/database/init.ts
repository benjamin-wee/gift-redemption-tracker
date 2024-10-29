import sqlite3 from 'sqlite3';
import { DB_PATH } from '../config/constants';

// Initializes the SQLite database
export function initDB(): sqlite3.Database {
    // Open the SQLite database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            throw new Error(`Failed to connect to database`);
        }
    });

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS staff_mapping (
                staff_pass_id TEXT PRIMARY KEY,
                team_name TEXT,
                created_at INTEGER
            )
        `, (err) => {
            if (err) throw new Error(`Failed to create staff_mapping table: ${err}`);
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS redemptions (
                team_name TEXT PRIMARY KEY,
                redeemed_at INTEGER
            )
        `, (err) => {
            if (err) throw new Error(`Failed to create redemptions table: ${err}`);
        });
    });

    return db;
}