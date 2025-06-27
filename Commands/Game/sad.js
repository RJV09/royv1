const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const anime = require("anime-actions");
module.exports = {
    name: "sad",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Express your sadness. 😢",
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
            const image = await anime.sad();

            const agreeEmbed = new EmbedBuilder()
                .setDescription(`${user.username} is feeling sad... 😢`)
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
