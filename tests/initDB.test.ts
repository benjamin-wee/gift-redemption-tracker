import { initDB } from '../src/database/init';
import { DB_PATH } from '../src/config/constants';
import sqlite3 from 'sqlite3';
import { existsSync } from 'fs';

describe('initDB', () => {
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

    it('should create the test database', () => {
        expect(existsSync(DB_PATH)).toBe(true);
    });

    it('should have the "staff_mapping" and "redemptions" tables', (done) => {
        db.all(
            `SELECT name FROM sqlite_master WHERE type='table'`,
            (err: Error | null, rows: { name: string }[]) => {
                expect(err).toBeNull();
                const tables = rows.map((row) => row.name);
                expect(tables).toContain('staff_mapping');
                expect(tables).toContain('redemptions');
                done();
            }
        );
    });

    it('should throw an error if the database fails to connect', async () => {
        jest.mock('../src/config/constants', () => ({
            DB_PATH: '/invalid/path/xxx',
        }));

        try {
            await initDB();
        } catch (error) {
            expect(error).toEqual(new Error('Failed to connect to database'));
        }
    });
});
