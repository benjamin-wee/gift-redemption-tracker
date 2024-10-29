import { lookupStaffPass } from '../src/services/redemption';
import { initDB } from '../src/database/init';
import sqlite3 from 'sqlite3';
import * as dbOperations from '../src/database/operations';

describe('Lookup Staff Pass', () => {
    let db: sqlite3.Database;

    beforeAll(async () => {
        db = initDB();

        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES ('STAFF_H123804820G', 'BASS', 1623772799000)`,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            db.serialize(() => {
                db.run('DROP TABLE IF EXISTS staff_mapping', (err) => {
                    if (err) reject(err);
                });

                db.run('DROP TABLE IF EXISTS redemptions', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        db.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the correct team name for a valid staff pass ID', async () => {
        const teamName = await lookupStaffPass('STAFF_H123804820G');
        expect(teamName).toBe('BASS');
    });

    it('should return null for a non-existent staff pass ID', async () => {
        const teamName = await lookupStaffPass('nonexistent-id');
        expect(teamName).toBeNull();
    });

    it('should throw an error if the lookup operation fails', async () => {
        // Mock `getTeamNameByStaffPass` to throw an error
        jest.spyOn(dbOperations, 'getTeamNameByStaffPass').mockRejectedValue(
            new Error('Database query failed')
        );

        await expect(lookupStaffPass('STAFF_H123804820G')).rejects.toThrow(
            'Failed to lookup staff pass ID: STAFF_H123804820G'
        );
    });
});
