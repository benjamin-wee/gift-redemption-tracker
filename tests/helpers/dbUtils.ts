import sqlite3 from 'sqlite3';

export const queryAsync = (
    db: sqlite3.Database,
    sql: string,
    params: any[] = []
): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};