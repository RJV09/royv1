const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const anime = require("anime-actions");
module.exports = {
    name: "smile",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Share a cheerful smile! 😊",
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
            const user = message.author;
            const image = await anime.smile();

            const agreeEmbed = new EmbedBuilder()
                .setDescription(`${user.username} is smiling! 😊`)
                .setImage(image) 
                .setColor("#FF66CC");

            await message.reply({
                embeds: [agreeEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
