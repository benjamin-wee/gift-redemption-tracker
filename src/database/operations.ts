import { initDB } from "./init";
import { StaffMappingRow } from "../utils/interfaces";
import { Database } from 'sqlite3';

export function insertStaffMapping(
    db: Database,
    staffPassId: string,
    teamName: string,
    createdAt: number
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'INSERT OR IGNORE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)',
            [staffPassId, teamName, createdAt],
            (err: any) => {
                if (err) {
                    reject(new Error(`Failed to insert ${staffPassId}: ${err}`));
                } else {
                    resolve();
                }
            }
        );
    });
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

// Query to get the team name for a given staff pass ID
export function getTeamNameByStaffPass(staffPassId: string): Promise<string | null> {
    const db = initDB();

    return new Promise((resolve, reject) => {
        db.get(
            'SELECT team_name FROM staff_mapping WHERE staff_pass_id = ?',
            [staffPassId],
            (err, row: StaffMappingRow | undefined) => {
                if (err) {
                    reject(new Error(`Database query failed: ${err}`));
                } else {
                    resolve(row?.team_name || null);
                }
            }
        );
    });
}

// Query to check if the team has already redeemed their gift
export function hasTeamRedeemed(teamName: string): Promise<boolean> {
    const db = initDB();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM redemptions WHERE team_name = ?', [teamName], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row);
            }
        });
    });
}

// Inserts a new redemption entry for the team
export function insertRedemption(teamName: string): Promise<void> {
    const db = initDB();
    const timestamp = Date.now();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO redemptions (team_name, redeemed_at) VALUES (?, ?)',
            [teamName, timestamp],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}