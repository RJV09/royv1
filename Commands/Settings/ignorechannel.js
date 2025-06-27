const guildSchema = require("../../Models/Guild");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ignorechannel",
  aliases: ["ignorechan", "ignorech"],
  category: "Settings",
  permission: "ManageGuild",
  desc: "Ignore or unignore a channel for bot commands",
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
      const guildId = message.guild.id;
      const action = args[0]?.toLowerCase();

      if (!["add", "remove", "list"].includes(action)) {
        const embed = new EmbedBuilder()
          .setColor("#FF66CC")
          .setDescription(
            `Invalid action. Use \`add\`, \`remove\`, or \`list\`.`
          );
        return message.reply({ embeds: [embed] });
      }

      let guildData = await guildSchema.findOne({ id: guildId });
      if (!guildData) {
        guildData = new guildSchema({ id: guildId });
      }

      guildData.ignoredChannels = guildData.ignoredChannels || [];

      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]) ||
        message.channel;

      if (action === "add") {
        if (guildData.ignoredChannels.includes(channel.id)) {
          return message.reply({
            content: `Channel <#${channel.id}> is already ignored.`,
          });
        }
        guildData.ignoredChannels.push(channel.id);
        await guildData.save();
        return message.reply({
          content: `Channel <#${channel.id}> is now ignored.`,
        });
      }

      if (action === "remove") {
        if (!guildData.ignoredChannels.includes(channel.id)) {
          return message.reply({
            content: `Channel <#${channel.id}> is not ignored.`,
          });
        }
        guildData.ignoredChannels = guildData.ignoredChannels.filter(
          (id) => id !== channel.id
        );
        await guildData.save();
        return message.reply({
          content: `Channel <#${channel.id}> is no longer ignored.`,
        });
      }

      if (action === "list") {
        if (!guildData.ignoredChannels.length) {
          return message.reply({
            content: `No ignored channels found in this server.`,
          });
        }
        const channelList = guildData.ignoredChannels
          .map((id, index) => `${index + 1}. <#${id}>`)
          .join("\n");
        const embed = new EmbedBuilder()
          .setColor("#FF66CC")
          .setTitle(`Ignored Channels`)
          .setDescription(channelList);
        return message.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error in ignorechannel command:", error);
      return message.reply(
        "An error occurred while managing ignored channels. Please try again later."
      );
    }
  },
};
