import { hasTeamRedeemed } from '../src/database/operations';
import sqlite3 from 'sqlite3';
import { initDB } from '../src/database/init';
import { queryAsync } from './helpers/dbUtils';
import * as dbOperations from '../src/database/operations';

describe('hasTeamRedeemed', () => {
    let db: sqlite3.Database;

    beforeAll(async () => {
        db = initDB();
    });

    afterEach(async () => {
        await queryAsync(db, 'DELETE FROM redemptions');
        jest.clearAllMocks();
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

    it('should return true if the team has redeemed', async () => {
        await queryAsync(
            db,
            'INSERT INTO redemptions (team_name, redeemed_at) VALUES (?, ?)',
            ['BASS', Date.now()]
        );

        const result = await hasTeamRedeemed('BASS');
        expect(result).toBe(true);
    });

    it('should return false if the team has not redeemed', async () => {
        const result = await hasTeamRedeemed('Nonexistent Team');
        expect(result).toBe(false);
    });

    it('should throw an error if the database query fails', async () => {

        const spy = jest.spyOn(dbOperations, 'hasTeamRedeemed').mockRejectedValue(
            new Error('Database query failed')
        );

        await expect(hasTeamRedeemed('BASS')).rejects.toThrow(
            'Database query failed'
        );

        expect(spy).toHaveBeenCalledWith('BASS');
    });
});
