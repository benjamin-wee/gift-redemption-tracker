import fs from 'fs';
import csv from 'csv-parser';
import { initDB } from './db';

// Function to populate the `staff_mapping` table
export async function loadStaffMapping(csvFilePath: string) {
    const db = initDB();

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            const { staff_pass_id, team_name, created_at } = row;

            db.run(
                'INSERT OR IGNORE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)',
                [staff_pass_id, team_name, parseInt(created_at)],
                (err) => {
                    if (err) {
                        console.error(`Failed to insert ${staff_pass_id}:`, err);
                    } else {
                        console.log(`Inserted ${staff_pass_id} -> ${team_name} at ${created_at}`);
                    }
                }
            );
        })
        .on('end', () => {
            console.log('staff_mapping table populated.');
        });
}