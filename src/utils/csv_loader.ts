import fs from 'fs';
import csv from 'csv-parser';
import { initDB } from '../database/init';
import { insertStaffMapping } from '../database/operations';

export async function loadStaffMapping(csvFilePath: string): Promise<string> {
    const db = initDB();

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(csvFilePath)) {
            return reject(new Error(`CSV file not found at path: ${csvFilePath}`));
        }

        const insertPromises: Promise<void>[] = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const { staff_pass_id, team_name, created_at } = row;

                const parsedCreatedAt = parseInt(created_at);

                const insertPromise = insertStaffMapping(db, staff_pass_id, team_name, parsedCreatedAt);
                insertPromises.push(insertPromise);
            })
            .on('end', async () => {
                try {
                    await Promise.all(insertPromises);  // Wait for all inserts to complete
                    db.close();
                    resolve('Staff mapping data loaded successfully.');
                } catch (error) {
                    db.close();
                    reject(error);
                }
            })
            .on('error', (err) => {
                db.close();
                reject(new Error(`Error reading CSV file: ${err.message}`));
            });
    });
}
