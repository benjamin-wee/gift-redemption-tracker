import { unlinkSync, existsSync } from 'fs';
import { DB_PATH } from './src/config/constants';

console.log('Running Jest teardown...');

export default async () => {
    if (existsSync(DB_PATH)) {
        unlinkSync(DB_PATH); // Delete the test DB after tests
        console.log('Test database removed.');
    } else {
        console.log('No test database to remove.');
    }
};