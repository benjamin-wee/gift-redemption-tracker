import { loadStaffMapping } from './csv_loader';  // CSV loader functions
import { redeemGift, lookupStaffPass } from './redemption';  // Redemption functions
import { dropTables } from './db';  // Database utility functions

async function main() {
    const [command, ...args] = process.argv.slice(2);  // Get command and arguments

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
        console.error('An error occurred:', err.message);
        printUsage();
        process.exit(1);
    }
}

// Helper function to print usage instructions
function printUsage() {
    console.log('Usage:');
    console.log('  load-staff <csvFilePath>       Load staff mapping data from a CSV');
    console.log('  load-redemptions <csvFilePath> Load redemptions data from a CSV');
    console.log('  redeem <teamName>              Redeem a gift for a team');
    console.log('  lookup <staffPassId>           Lookup the team for a staff pass ID');
    console.log('  drop-tables                    Drop all tables (for testing purposes)');
}

// Run the main function
main();
