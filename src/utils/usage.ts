export function printUsage() {
    console.log('Usage:');
    console.log('  load-staff <csvFilePath>       Load staff mapping data from a CSV');
    console.log('  redeem <staffPassId>           Redeem a gift for a staff pass ID');
    console.log('  lookup <staffPassId>           Lookup the team for a staff pass ID');
    console.log('  drop-tables                    Drop all tables (for testing purposes)');
}
