const { EmbedBuilder } = require("discord.js");
const anime = require("anime-actions");

module.exports = {
    name: "pat",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Pat someone on the head!",
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

            const image = await anime.pat();

            const description = mentionedUser === message.author
                ? `${message.author.username} pats themselves! 🖐️`
                : `${message.author.username} pats ${mentionedUser.username}! 🖐️`;

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
