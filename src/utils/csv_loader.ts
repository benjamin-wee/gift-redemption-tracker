import fs from 'fs';
import csv from 'csv-parser';
import { initDB } from '../database/init';

// Function to populate the `staff_mapping` table without internal logging
export async function loadStaffMapping(csvFilePath: string): Promise<string> {
    const db = initDB()
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const { staff_pass_id, team_name, created_at } = row;

                // Insert data into the staff_mapping table
                db.run(
                    'INSERT OR IGNORE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)',
                    [staff_pass_id, team_name, parseInt(created_at)],
                    (err) => {
                        if (err) {
                            reject(`Failed to insert ${staff_pass_id}: ${err.message}`);
                        }
                    }
                );
            })
            .on('end', () => {
                resolve('Staff mapping data loaded successfully.');
            })
            .on('error', (err) => {
                reject(`Error reading CSV file: ${err.message}`);
            });
    });
}
