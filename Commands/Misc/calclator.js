const simplydjs = require("simply-djs");

module.exports = {
    name: "calculate",
    aliases: ["calc"],
    category: "Misc",
    permission: "",
    desc: "Perform a simple calculation.",
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
            simplydjs.calculator(message, {
                embedColor: client.config.color,
                credit: false,
                resultPreview: false,
                showCredits: false,
                showResult: false,
            });
        } catch (e) {
            console.error(e);
            message.reply("An error occurred while running the command!");
        }
    },
};
