async function updateTopHelperRole(guild, voteManager, topHelperRoleId) {
    const topHelperRole = await guild.roles.fetch(topHelperRoleId).catch(() => null);

    if (!topHelperRole) {
        const errorMessage = `[ERROR] Top Voter Role with ID ${topHelperRoleId} not found in guild ${guild.name}.`;
        console.error(errorMessage);
        return { success: false, message: 'Configuration error: Top Voter Role not found.' };
    }

    const leaderboard = voteManager.getLeaderboard(15);
    const topUserIds = new Set(leaderboard.map(u => u.target_id));
    const currentRoleHolders = new Set(topHelperRole.members.map(m => m.id));

    for (const userId of topUserIds) {
        if (currentRoleHolders.has(userId)) {
            continue;
        }

        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) {
            continue;
        }

        await member.roles
            .add(topHelperRole)
            .catch(e => console.error(`Failed to add role to ${member.user.tag}:`, e));
    }

    for (const userId of currentRoleHolders) {
        if (topUserIds.has(userId)) {
            continue;
        }

        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) {
            continue;
        }

        await member.roles
            .remove(topHelperRole)
            .catch(e => console.error(`Failed to remove role from ${member.user.tag}:`, e));
    }

    console.log('[TASK] Role update finished.');
    return { success: true, message: 'Top voter roles have been successfully updated.' };
}

// Export the function so it can be used by other files
module.exports = { updateTopHelperRole };
