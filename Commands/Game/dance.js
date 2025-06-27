const { EmbedBuilder } = require("discord.js");
const anime = require("anime-actions");

module.exports = {
    name: "dance",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Dance with someone!",
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
            // Check if a user is mentioned
            const mentionedUser = message.mentions.users.first() || message.author;

            // Get the cuddle image from anime-actions
            const image = await anime.dance();

            // If a user is mentioned, the description will reflect that
            const description = mentionedUser === message.author
                ? `${message.author.username} dances with themselves! 💃🕺`
                : `${message.author.username} dances with ${mentionedUser.username}! 💃🕺`;

            // Create the embed
            const cuddleEmbed = new EmbedBuilder()
                .setDescription(description)
                .setImage(image)
                .setColor("#FF66CC");

            // Send the embed to the channel
            await message.reply({
                embeds: [cuddleEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
