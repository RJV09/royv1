const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "boostcount",
    aliases: ["bc"],
    category: "Misc",
    permission: "",
    desc: "Shows the total number of boosts in the server.",
    dev: false,
    options: {
        owner: false,
        inVc: false,
        sameVc: false,
        player: {
            playing: false,
            active: false,
        },
        premium: false,
        vote: false,
    },
    run: async ({ client, message, args }) => {
        try {
            const guild = message.guild;
            const boostCount = guild.premiumSubscriptionCount;

            const boostCountEmbed = new EmbedBuilder()
                .setColor("#FF66CC")
                .setTitle(`Boost Count`)
                .setDescription(`**${boostCount}**`)
                .setTimestamp();

            await message.reply({
                embeds: [boostCountEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while fetching the boost count.");
        }
    },
};
