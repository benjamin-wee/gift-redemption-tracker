import { insertRedemption } from '../src/database/operations';
import sqlite3 from 'sqlite3';
import { initDB } from '../src/database/init';
import { queryAsync } from './helpers/dbUtils';

describe('Insert Redemption', () => {
    let db: sqlite3.Database;

    beforeAll(async () => {
        db = initDB();
    });

    afterEach(async () => {
        await queryAsync(db, 'DELETE FROM redemptions');
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

    it('should insert a new redemption successfully', async () => {
        await insertRedemption('BASS');

        const rows = await queryAsync(
            db,
            'SELECT * FROM redemptions WHERE team_name = ?',
            ['BASS']
        );

        expect(rows.length).toBe(1);
        expect(rows[0].team_name).toBe('BASS');
        expect(typeof rows[0].redeemed_at).toBe('number');
    });

    it('should throw an error if the team name is already redeemed', async () => {
        // Insert the first redemption
        await insertRedemption('BASS');

        // Insert the same team again, which fails
        await expect(insertRedemption('BASS')).rejects.toThrow(
            /UNIQUE constraint failed: redemptions.team_name/
        );
    });
});
