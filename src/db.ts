import sqlite3 from 'sqlite3';  // Import sqlite3

const DB_PATH = './gift_redemption.db';

// Initializes the SQLite database
export function initDB(): sqlite3.Database {
    // Open the SQLite database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
        } else {
            console.log('Connected to SQLite database.');
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
            if (err) {
                console.error('Failed to create staff_mapping table:', err);
            } else {
                console.log('staff_mapping table is ready.');
            }
        });

        // Ensure the `redemptions` table is created
        db.run(`
            CREATE TABLE IF NOT EXISTS redemptions (
                team_name TEXT PRIMARY KEY,
                redeemed_at INTEGER
            )
        `, (err) => {
            if (err) {
                console.error('Failed to create redemptions table:', err);
            } else {
                console.log('redemptions table is ready.');
            }
        });
    });

    return db;
}

export function dropTables(): void {
    const db = initDB();

    // Drop the `staff_mapping` table if it exists
    db.run('DROP TABLE IF EXISTS staff_mapping', (err) => {
        if (err) {
            console.error('Failed to drop staff_mapping table:', err);
        } else {
            console.log('Dropped staff_mapping table.');
        }
    });

    // Drop the `redemptions` table if it exists
    db.run('DROP TABLE IF EXISTS redemptions', (err) => {
        if (err) {
            console.error('Failed to drop redemptions table:', err);
        } else {
            console.log('Dropped redemptions table.');
        }
    });

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Failed to close the database:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
}