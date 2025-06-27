const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "filter",
    aliases: ["filters"],
    category: "Filters",
    permission: "",
    desc: "Apply different filters to the music.",
    dev: false,
    options: {
        owner: false,
        inVc: true,
        sameVc: true,
        player: {
            playing: true,
            active: true,
        },
        premium: false,
        vote: false,
    },
    run: async ({ client, message, args }) => {
        try {
            const filterEmbed = new EmbedBuilder()
                .setColor("#FF66CC")
                .setTitle("Audio Filters")
                .setDescription("Choose a filter to apply to the music:")
                .addFields(
                    { name: "Balanced", value: "Apply Balanced Filter to the Music!", inline: true },
                    { name: "Bassboost", value: "Apply the Bassboost Filter.", inline: true },
                    { name: "Classical", value: "Apply the Classical Filter.", inline: true },
                    { name: "Electronic", value: "Apply the Electronic Filter.", inline: true },
                    { name: "Enhance", value: "Enhance audio quality by setting bitrate, volume, and filters.", inline: true },
                    { name: "Flat", value: "Removes all filters from the music.", inline: true },
                    { name: "Treblebass", value: "Applies the treble filter to the current song.", inline: true },
                    { name: "Vocal-Boost", value: "Apply the Vocal Boost Filter.", inline: true }
                )
                .setFooter({ text: "Use the appropriate command to apply the filters." });

            // Send the embed to the channel
            await message.reply({
                embeds: [filterEmbed]
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
