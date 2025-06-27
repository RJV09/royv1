const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  aliases: ["disconnect", "dc"],
  category: "Music",
  permission: "ManageGuild",
  desc: "sofia leaves the voice channel",dev: false,
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message, args }) => {
    try {
      const userVc = message.member.voice.channel;
      const botVc = message.guild.members.me.voice.channel;

      if (!userVc) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `You need to be in a voice channel to use this command`,
            iconURL: message.author.displayAvatarURL(),
          })
          .setColor(client.config.color);
        return message.channel
          .send({
            embeds: [embed],
          })
          .then((x) => {
            setTimeout(() => x.delete(), 5000);
          });
      }

      if (botVc && userVc.id !== botVc.id) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `You must be in the same voice channel as me to use this command`,
            iconURL: message.author.displayAvatarURL(),
          })
          .setColor(client.config.color);
        return message.channel
          .send({
            embeds: [embed],
          })
          .then((x) => {
            setTimeout(() => x.delete(), 5000);
          });
      }
      client.music.Disconnect(message);
    } catch (e) {
      console.log(e);
    }
  },
};
