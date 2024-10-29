import { getTeamNameByStaffPass } from '../database/operations';
import { hasTeamRedeemed, insertRedemption } from '../database/operations';

// Lookup staff by their staff_pass_id
export async function lookupStaffPass(staffPassId: string): Promise<string | null> {
    try {
        const teamName = await getTeamNameByStaffPass(staffPassId);
        return teamName;
    } catch (err: any) {
        throw new Error(`Failed to lookup staff pass ID: ${staffPassId}`);
    }
}

// Redeem a gift based on the staff pass id
export async function redeemGift(staffPassId: string): Promise<{ success: boolean; teamName: string | null }> {
    try {
        // Lookup the team name for the given staff pass ID
        const teamName = await lookupStaffPass(staffPassId);

        if (!teamName) {
            return { success: false, teamName: null };  // No team found
        }

        // Check if the team has already redeemed their gift
        const alreadyRedeemed = await hasTeamRedeemed(teamName);

        if (alreadyRedeemed) {
            return { success: false, teamName };  // Gift already redeemed
        }

        // Insert a new redemption entry for the team
        await insertRedemption(teamName);

        return { success: true, teamName };  // Gift successfully redeemed
    } catch (err: any) {
        throw new Error(`Error during redemption: ${err.message}`);
    }
}