import { loadStaffMapping } from './utils/csv_loader';
import { redeemGift, lookupStaffPass } from './services/redemption';
import { dropTables } from './database/operations';
import { printUsage } from './utils/usage';

async function main() {
    const [command, ...args] = process.argv.slice(2);  // Get command and argument

    try {
        switch (command) {
            case 'load-staff':
                const staffCsvPath = args[0];
                if (!staffCsvPath) {
                    throw new Error('Please provide the path to the staff mapping CSV.');
                }
                console.log(`Loading staff mapping data from: ${staffCsvPath}`);
                const result = await loadStaffMapping(staffCsvPath);
                console.log(result);
                break;

            case 'redeem':
                const staffPass = args[0];
                if (!staffPass) {
                    throw new Error('Please provide a staff_pass_id to redeem the gift.');
                }
                const { success, teamName } = await redeemGift(staffPass);
                if (success) {
                    console.log(`Gift redeemed successfully for team: ${teamName}`);
                } else if (!teamName) {
                    console.log(`No team found for staff pass ID: ${staffPass}`);
                } else {
                    console.log(`Gift has already been redeemed for team: ${teamName}`);
                }
                break;

            case 'lookup':
                const staffPassId = args[0];
                if (!staffPassId) {
                    throw new Error('Please provide a staff pass ID to lookup.');
                }
                const team = await lookupStaffPass(staffPassId);
                if (team) {
                    console.log(`Staff with ID ${staffPassId} belongs to team: ${team}`);
                } else {
                    console.log(`No team found for staff pass ID: ${staffPassId}`);
                }
                break;

            case 'drop-tables':
                console.log('Dropping all tables...');
                const dropTableResult = await dropTables();
                console.log(dropTableResult);
                break;

            default:
                console.log('Invalid command.');
                printUsage();
                process.exit(1);
        }
    } catch (err: any) {
        console.error('An error occurred:', err);
        printUsage();
        process.exit(1);
    }
}

// Run the main function
main();
