const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "move",
  aliases: ["mv"],
  category: "Music",
  desc: "Move Sofia to your voice channel",
  dev: false,
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message }) => {
    try {
      const { member, guild, channel } = message;

      if (!member.voice.channel) {
        return sendEmbed(channel, `You need to be in a voice channel to use this command`, client.config.color);
      }

      const userVoiceChannel = member.voice.channel;
      const player = client.kazagumo.players.get(guild.id);

      if (!player) {
        return sendEmbed(channel, `I am not connected to any voice channel`, client.config.color);
      }

      const botVoiceChannel = guild.members.me.voice.channel;

      if (!botVoiceChannel) {
        return sendEmbed(channel, `I am not in a voice channel`, client.config.color);
      }

      if (player.playing && botVoiceChannel.members.filter((m) => !m.user.bot).size > 0) {
        return sendEmbed(
          channel,
          `I am already playing music in <#${botVoiceChannel.id}>. I cannot move right now.`,
          client.config.color
        );
      }

      await player.setVoiceChannel(userVoiceChannel.id);
      await guild.members.me.voice.setChannel(userVoiceChannel.id);

      return sendEmbed(channel, `**I have moved to <#${userVoiceChannel.id}>**`, client.config.color);
    } catch (error) {
      console.error(error);
      return sendEmbed(message.channel, "An error occurred while processing the command.", "Red");
    }
  },
};

async function sendEmbed(channel, content, color) {
  const embed = new EmbedBuilder().setDescription(content).setColor(color);
  return await channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => msg.delete(), 5000));
}
