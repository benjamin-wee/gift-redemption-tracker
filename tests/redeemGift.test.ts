import { redeemGift } from '../src/services/redemption';
import sqlite3 from 'sqlite3';
import { initDB } from '../src/database/init';
import { queryAsync } from './helpers/dbUtils';
import * as dbOperations from '../src/database/operations';
import * as redemptionService from '../src/services/redemption';

describe('Redeem Gift (with real database)', () => {
    let db: sqlite3.Database;

    beforeAll(async () => {
        db = initDB();

        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO staff_mapping (staff_pass_id, team_name, created_at) VALUES ('STAFF_H123804820G', 'BASS', 1623772799000)`,
                (err) => (err ? reject(err) : resolve())
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

    afterEach(async () => {
        jest.clearAllMocks();
        await new Promise<void>((resolve, reject) => {
            db.run('DELETE FROM redemptions', (err) => (err ? reject(err) : resolve()));
        });
    });

    it('should successfully redeem a gift for a valid staff pass ID', async () => {
        const result = await redeemGift('STAFF_H123804820G');

        expect(result).toEqual({ success: true, teamName: 'BASS' });

        const redemptions = await queryAsync(db, 'SELECT * FROM redemptions WHERE team_name = ?', [
            'BASS',
        ]);
        expect(redemptions.length).toBe(1);
    });

    it('should return success: false if the staff pass ID is invalid', async () => {
        const result = await redeemGift('invalid-id');

        expect(result).toEqual({ success: false, teamName: null });

        const redemptions = await queryAsync(db, 'SELECT * FROM redemptions');
        expect(redemptions.length).toBe(0);
    });

    it('should return success: false if the gift has already been redeemed', async () => {
        await redeemGift('STAFF_H123804820G');

        const result = await redeemGift('STAFF_H123804820G');

        expect(result).toEqual({ success: false, teamName: 'BASS' });

        const redemptions = await queryAsync(db, 'SELECT * FROM redemptions WHERE team_name = ?', [
            'BASS',
        ]);
        expect(redemptions.length).toBe(1);
    });

    it('should throw an error if the redemption operation fails', async () => {
        jest.spyOn(redemptionService, 'lookupStaffPass').mockResolvedValue('BASS');

        jest.spyOn(dbOperations, 'hasTeamRedeemed').mockResolvedValue(false);

        jest.spyOn(dbOperations, 'insertRedemption').mockRejectedValue(
            new Error('Database query failed')
        );

        await expect(redeemGift('STAFF_H123804820G')).rejects.toThrow(
            'Error during redemption: Database query failed'
        );
    });
});
