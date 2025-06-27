const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "join",
  aliases: ["j", "connect"],
  category: "Music",
  desc: "sofia joins the voice channel",
  dev: false,
  options: {
    owner: false,
    inVc: true,
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
      if (!message.member.voice.channel) {
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

      const voiceChannel = message.member.voice.channel;
      let player = client.kazagumo.players.get(message.guild.id);

      // Check if the bot is already connected to a different voice channel
      if (player && message.guild.members.me.voice.channelId !== voiceChannel.id) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `I am already playing music in <#${message.guild.members.me.voice.channelId}>`,
            iconURL: client.user.displayAvatarURL(),
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

      if (!player) {
        player = await client.music.CreatesofiaPlayer(message);
      } else {
        await message.guild.members.me.voice.setChannel(voiceChannel.id);
        await player.setVoiceChannel(voiceChannel.id);
      }

      return await message.channel.send(
        `**I have Joined <#${voiceChannel.id}>**`
      );
    } catch (e) {
      console.log(e);
    }
  },
};
