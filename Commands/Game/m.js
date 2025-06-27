module.exports = {
  name: "m",
  aliases: ["temp"],
  category: "Game",
  permission: "",
  desc: "Temporary placeholder command",
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
    message.reply("This command is currently under development.");
  }
};