const { EmbedBuilder } = require("discord.js");
const anime = require("anime-actions");

module.exports = {
    name: "bonk",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Bonk someone on the head with a cute anime image",
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

            // Get the bonk image from anime-actions
            const image = await anime.bonk();

            // If a user is mentioned, the description will reflect that
            const description = mentionedUser === message.author
                ? `${message.author.username} bonks the air!`
                : `${message.author.username} bonks ${mentionedUser.username} on the head! 🤦‍♂️`;

            // Create the embed
            const bonkEmbed = new EmbedBuilder()
                .setDescription(description)
                .setImage(image)
                .setColor("#FF66CC");

            // Send the embed to the channel
            await message.reply({
                embeds: [bonkEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};