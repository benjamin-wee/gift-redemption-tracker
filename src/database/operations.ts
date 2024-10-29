import { initDB } from "./init";

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