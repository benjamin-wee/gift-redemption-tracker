import { Database } from 'sqlite3';
import { initDB } from './database/init';

interface StaffMappingRow {
    team_name: string;
}

// Lookup staff by their staff_pass_id
export async function lookupStaffPass(staffPassId: string, db: Database = initDB()): Promise<string | null> {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT team_name FROM staff_mapping WHERE staff_pass_id = ?',
            [staffPassId],
            (err, row: StaffMappingRow | undefined) => {
                if (err) {
                    reject(err);  // Handle the error
                } else {
                    resolve(row?.team_name || null);  // Resolve with the team name or null if not found
                }
            }
        );
    });
}

// Redeem a gift based on the staff pass id
export async function redeemGift(staffPassId: string): Promise<{ success: boolean; teamName: string | null }> {
    const db = initDB();

    try {
        // Use lookupStaffPass to get the team name for the given staff_pass_id
        const teamName = await lookupStaffPass(staffPassId, db);

        if (!teamName) {
            console.log(`No team found for staff pass ID: ${staffPassId}`);
            return { success: false, teamName: null };
        }

        return new Promise((resolve, reject) => {
            // Check if the team has already redeemed their gift
            db.get('SELECT * FROM redemptions WHERE team_name = ?', [teamName], (err, row) => {
                if (err) {
                    reject(err);  // Reject the promise if an error occurs
                } else if (row) {
                    resolve({ success: false, teamName });  // Team already redeemed
                } else {
                    // If not redeemed, insert a new redemption
                    const timestamp = Date.now();
                    db.run(
                        'INSERT INTO redemptions (team_name, redeemed_at) VALUES (?, ?)',
                        [teamName, timestamp],
                        (insertErr) => {
                            if (insertErr) {
                                reject(insertErr);  // Reject the promise if insertion fails
                            } else {
                                resolve({ success: true, teamName });  // Resolve with success and team name
                            }
                        }
                    );
                }
            });
        });
    } catch (error: any) {
        console.error(`Error during redemption: ${error.message}`);
        return { success: false, teamName: null };
    }
}