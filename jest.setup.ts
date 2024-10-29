import { unlinkSync, existsSync } from 'fs';
import { DB_PATH } from './src/config/constants';

console.log('Running Jest setup...');

export default async () => {
    if (existsSync(DB_PATH)) {
        unlinkSync(DB_PATH); // Ensure the test DB is removed before tests
        console.log('Old test database removed.');
    } else {
        console.log('No old test database found.');
    }
};
