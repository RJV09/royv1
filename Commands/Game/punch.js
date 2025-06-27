const { EmbedBuilder } = require("discord.js");
const anime = require("anime-actions");

module.exports = {
    name: "punch",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Punch someone!",
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

            const image = await anime.punch();

            const description = mentionedUser === message.author
                ? `${message.author.username} punches the air! 👊`
                : `${message.author.username} punches ${mentionedUser.username}! 👊`;

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
