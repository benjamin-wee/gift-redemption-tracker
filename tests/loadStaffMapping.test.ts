import { loadStaffMapping } from '../src/utils/csv_loader';
import { initDB } from '../src/database/init';
import sqlite3 from 'sqlite3';
import path from 'path';
import { queryAsync } from './helpers/dbUtils';

const csvFilePath = path.resolve(__dirname, '../staff-id-to-team-mapping.csv');

describe('Load Staff Mapping', () => {
    let db: sqlite3.Database;

    beforeAll((done) => {
        db = initDB();
        db.serialize(() => {
            db.run('SELECT 1', () => {
                done();
            });
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

    it('should load staff mapping data successfully', async () => {
        const result = await loadStaffMapping(csvFilePath);
        expect(result).toBe('Staff mapping data loaded successfully.');
    });

    it('should correctly insert data from the CSV file', async () => {
        await loadStaffMapping(csvFilePath);

        const rows = await queryAsync(db, 'SELECT * FROM staff_mapping');

        expect(rows).toEqual(
            expect.arrayContaining([
                { staff_pass_id: 'STAFF_H123804820G', team_name: 'BASS', created_at: 1623772799000 },
                { staff_pass_id: 'MANAGER_T999888420B', team_name: 'RUST', created_at: 1623772799000 },
                { staff_pass_id: 'BOSS_T000000001P', team_name: 'RUST', created_at: 1623872111000 },
            ])
        );
    });

    it('should throw an error if the CSV file is missing', async () => {
        const invalidCsvPath = path.resolve(__dirname, 'non_existent.csv');

        await expect(loadStaffMapping(invalidCsvPath)).rejects.toThrow(
            'CSV file not found at path:'
        );
    }, 10000);
});
