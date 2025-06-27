const guildSchema = require("../../Models/Guild");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "prefix",
  aliases: ["setprefix"],
  category: "Settings",
  permission: "ManageGuild",
  dev: false,
  desc: "Change the Prefix of the Bot in the Server",
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

  run: async ({ client, message, args, interaction }) => {
    try {
      // Handle both slash commands and message commands
      const isSlash = !!interaction;
      const guild = isSlash ? interaction.guild : message.guild;
      const user = isSlash ? interaction.user : message.author;
      const newPrefix = isSlash ? interaction.options.getString('newprefix') : args[0];

      let guildData = await guildSchema.findOne({ id: guild.id });
      if (!guildData) {
        guildData = await guildSchema.findOneAndUpdate(
          { id: guild.id },
          { $setOnInsert: { id: guild.id, prefix: "?" } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      guildData = await guildSchema.findOne({ id: guild.id });
      let oldPrefix = guildData.prefix;

      if (!newPrefix) {
        const embed = new EmbedBuilder()
          .setColor("#FF66CC")
          .setAuthor({
            name: `${guild.name} Prefix Settings`,
            iconURL: guild.iconURL(),
          })
          .setDescription(`- **Server Prefix**: \`${guildData.prefix}\``);

        if (isSlash) {
          return await interaction.reply({ embeds: [embed] });
        } else {
          return await client.message.send(message, { embeds: [embed] });
        }
      }

      await guildSchema.findOneAndUpdate(
        { id: guild.id },
        { $set: { prefix: newPrefix } },
        { new: true }
      );

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({
          name: `${guild.name} Prefix Settings`,
          iconURL: guild.iconURL(),
        })
        .setDescription(
          `- **Prefix Changed** from \`${oldPrefix}\` to \`${newPrefix}\``
        )
        .setFooter({
          text: `Updated by ${user.username}`,
          iconURL: user.avatarURL(),
        })
        .setTimestamp();

      if (isSlash) {
        return await interaction.reply({ embeds: [embed] });
      } else {
        return await client.message.send(message, { embeds: [embed] });
      }
    } catch (error) {
      console.error("Error updating prefix: ", error);
      const errorMessage = "An error occurred while executing this command";

      if (interaction) {
        return await interaction.reply({ content: errorMessage, flags: 64 });
      } else {
        return await client.message.send(message, { content: errorMessage });
      }
    }
  },
};