import sqlite3 from 'sqlite3';  // Import sqlite3

const DB_PATH = './gift_redemption.db';

// Initializes the SQLite database
export function initDB(): sqlite3.Database {
    // Open the SQLite database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            throw new Error(`Failed to connect to database: ${err.message}`);
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
            if (err) throw new Error(`Failed to create staff_mapping table: ${err.message}`);
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS redemptions (
                team_name TEXT PRIMARY KEY,
                redeemed_at INTEGER
            )
        `, (err) => {
            if (err) throw new Error(`Failed to create redemptions table: ${err.message}`);
        });
    });

    return db;
}

export async function dropTables(): Promise<string> {
    const db = initDB();  // Initialize the database connection

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Drop the `staff_mapping` table
            db.run('DROP TABLE IF EXISTS staff_mapping', (err) => {
                if (err) {
                    reject('Failed to drop staff_mapping table.');
                    return;  // Stop further execution if an error occurs
                }
            });

            // Drop the `redemptions` table
            db.run('DROP TABLE IF EXISTS redemptions', (err) => {
                if (err) {
                    reject('Failed to drop redemptions table.');
                    return;  // Stop further execution if an error occurs
                }
            });

            // Close the database connection
            db.close((err) => {
                if (err) {
                    reject(`Failed to close the database: ${err.message}`);
                } else {
                    resolve('All tables dropped successfully. Database connection closed.');
                }
            });
        });
    });
}