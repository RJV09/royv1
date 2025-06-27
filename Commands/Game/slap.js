const { EmbedBuilder } = require("discord.js");
const anime = require("anime-actions");

module.exports = {
    name: "slap",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Give someone a virtual slap!",
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
            const mentionedUser = message.mentions.users.first() || message.author;

            const image = await anime.slap();

            const description = mentionedUser === message.author
                ? `${message.author.username} gives the air a slap! 😠`
                : `${message.author.username} gives ${mentionedUser.username} a slap! 😠`;

            const cuddleEmbed = new EmbedBuilder()
                .setDescription(description)
                .setImage(image)
                .setColor("#FF66CC");

            await message.reply({
                embeds: [cuddleEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
