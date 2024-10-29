import fs from 'fs';
import csv from 'csv-parser';
import { initDB } from '../database/init';

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

                const insertPromise = new Promise<void>((res, rej) => {
                    db.run(
                        'INSERT OR IGNORE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)',
                        [staff_pass_id, team_name, parseInt(created_at)],
                        (err) => {
                            if (err) {
                                rej(new Error(`Failed to insert ${staff_pass_id}: ${err}`));
                            } else {
                                res();
                            }
                        }
                    );
                });

                insertPromises.push(insertPromise);
            })
            .on('end', async () => {
                try {
                    await Promise.all(insertPromises); // Wait for all inserts to complete
                    resolve('Staff mapping data loaded successfully.');
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (err) => {
                reject(new Error(`Error reading CSV file: ${err}`));
            });
    });
}
