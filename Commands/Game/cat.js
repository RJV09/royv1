const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "catsay",
    aliases: [],
    category: "Games",
    permission: "",
    desc: "Send a cute cat image with a custom message",
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
            // If no message is provided, prompt the user to send something
            if (args.length === 0) {
                return message.reply("What do you want the cat to say?");
            }

            // Get the message to be displayed on the cat image
            const msg = args.join(" ");

            // Fetch the cat image with the message from the API
            const response = await fetch(`https://cataas.com/cat/cute/says/${encodeURIComponent(msg)}`);
            if (!response.ok) {
                return message.reply("Failed to fetch cat image. Please try again later.");
            }

            // Send the cat image to the channel
            const catImage = response.url;
            const catEmbed = new EmbedBuilder()
                .setDescription(`${message.author.username} asked a cat to say: "${msg}"`)
                .setImage(catImage)
                .setColor("#FF66CC");

            await message.reply({
                embeds: [catEmbed],
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
