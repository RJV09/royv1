const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membercount",
    aliases: ["mc"],
    category: "Misc",
    permission: "",
    desc: "Shows the total number of members in the server.",
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
            // Get the server (guild) information
            const guild = message.guild;

            // Get the member count
            const memberCount = guild.memberCount;

            // Create an embed to display the member count
            const memberCountEmbed = new EmbedBuilder()
                .setColor("#FF66CC")
                .setTitle(`Member Count`)
                .setDescription(`**${memberCount}**`)
                .setTimestamp();

            // Send the embed
            await message.reply({
                embeds: [memberCountEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while fetching the member count.");
        }
    },
};
