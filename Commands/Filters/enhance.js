const { EmbedBuilder } = require("discord.js");

const ctx = async (channel, content, color = "#FF66CC", timeout = 5000, title = null) => {
  const embed = new EmbedBuilder()
    .setDescription(content)
    .setColor(color);
  
  if (title) embed.setTitle(title);

  const msg = await channel.send({ embeds: [embed] });
  if (timeout) setTimeout(() => msg.delete().catch(() => {}), timeout);
};

module.exports = {
  name: "enhance",
  aliases: ["enh"],
  category: "Filters",
  desc: "Enhance audio quality by setting bitrate, volume, and filters.",
  dev: false,
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message }) => {
    try {
      if (!message.member.voice.channel) {
        return ctx(
          message.channel,
          "You need to be in a voice channel to use this command.",
          client.config.color,
          10000,
          "❌ Error"
        );
      }
      const a = client.kazagumo.players.get(message.guild.id);
      const guild = message.guild;
      const channel = message.member.voice.channel;
      let aplayer = client.kazagumo.players.get(guild.id);
      let player = aplayer.shoukaku;

      if (!player) {
        return ctx(
          message.channel,
          "There is no song currently playing.",
          "Red",
          10000,
          "❌ Error"
        );
      }

      // Determine bitrate based on guild premium tier
      let bitrate = 64000; // Default bitrate
      switch (guild.premiumTier) {
        case 1:
          bitrate = 128000;
          break;
        case 2:
          bitrate = 256000;
          break;
        case 3:
          bitrate = 384000;
          break;
      }

      let responseMessage;
      try {
        await channel.edit({ bitrate });
        responseMessage = `<a:yes:1265666029091029104> Set voice channel bitrate to **${bitrate / 1000}kbps**.`;
      } catch {
        responseMessage =
          "⚠️ Unable to set the bitrate. Please set it to the maximum manually.";
      }
      let player1 = client.kazagumo.players.get(message.guild.id);

      // Apply audio filters and volume
      await player.setFilters({
        op: "filters",
        guildId: guild.id,
        equalizer: [
          { band: 0, gain: 0.025 },
          { band: 1, gain: 0.03 },
          { band: 2, gain: 0.06 },
          { band: 3, gain: 0.01 },
          { band: 4, gain: 0.0625 },
          { band: 5, gain: 0.0125 },
          { band: 6, gain: -0.025 },
          { band: 7, gain: -0.05 },
          { band: 8, gain: -0.025 },
          { band: 9, gain: 0.01 },
          { band: 10, gain: 0.005 },
          { band: 11, gain: 0.0325 },
          { band: 12, gain: 0.05 },
          { band: 13, gain: 0.07 },
          { band: 14, gain: 0.04 },
        ],
        volume: 0.8, // Set volume to 80%
      });
      a.setVolume(80);

      await ctx(
        message.channel,
        `${responseMessage}\n**✨ Enhanced audio settings applied !**`,
        client.config.color,
        10000,
        "✨ Enhancement Complete"
      );
    } catch (e) {
      console.error(e);
      return ctx(
        message.channel,
        "An error occurred while enhancing audio settings.",
        "Red",
        10000,
        "❌ Error"
      );
    }
  },
};