
const { EmbedBuilder } = require("discord.js");
const guildSchema = require("../../Models/Guild");

module.exports = {
  name: "noprefix",
  aliases: ["np", "nopre"],
  category: "Settings",
  permission: "ManageGuild",
  desc: "Configure no-prefix settings for the server",
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

  run: async ({ client, message, args, interaction }) => {
    try {
      // Handle both slash commands and message commands
      const isSlash = !!interaction;
      const guild = isSlash ? interaction.guild : message.guild;
      const user = isSlash ? interaction.user : message.author;
      const action = isSlash ? interaction.options.getString('action') : args[0]?.toLowerCase();
      const targetUser = isSlash ? interaction.options.getUser('user') : 
        (message.mentions.users.first() || 
         (args[1] ? await client.users.fetch(args[1]).catch(() => null) : null));

      let guildData = await guildSchema.findOne({ id: guild.id });
      if (!guildData) {
        guildData = await guildSchema.findOneAndUpdate(
          { id: guild.id },
          { $setOnInsert: { id: guild.id, noPrefixUsers: [] } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }

      // If no guildData.noPrefixUsers exists, initialize it
      if (!guildData.noPrefixUsers) {
        guildData.noPrefixUsers = [];
      }

      if (!action || !["add", "remove", "list", "toggle"].includes(action)) {
        const embed = new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setAuthor({
            name: `${guild.name} No-Prefix Settings`,
            iconURL: guild.iconURL(),
          })
          .setDescription(
            `**Usage:**\n` +
            `\`${guildData.prefix || client.config.def_prefix}noprefix add @user\` - Add user to no-prefix list\n` +
            `\`${guildData.prefix || client.config.def_prefix}noprefix remove @user\` - Remove user from no-prefix list\n` +
            `\`${guildData.prefix || client.config.def_prefix}noprefix list\` - Show all no-prefix users\n` +
            `\`${guildData.prefix || client.config.def_prefix}noprefix toggle\` - Toggle server no-prefix mode\n\n` +
            `**Current Settings:**\n` +
            `Server No-Prefix: ${guildData.serverNoPrefix ? '✅ Enabled' : '❌ Disabled'}\n` +
            `No-Prefix Users: ${guildData.noPrefixUsers.length} users`
          )
          .setFooter({
            text: `Requested by ${user.username}`,
            iconURL: user.avatarURL(),
          });

        if (isSlash) {
          return await interaction.reply({ embeds: [embed] });
        } else {
          return await client.message.send(message, { embeds: [embed] });
        }
      }

      if (action === "toggle") {
        guildData.serverNoPrefix = !guildData.serverNoPrefix;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setAuthor({
            name: `${guild.name} No-Prefix Settings`,
            iconURL: guild.iconURL(),
          })
          .setDescription(
            `Server no-prefix mode has been **${guildData.serverNoPrefix ? 'enabled' : 'disabled'}**\n\n` +
            `${guildData.serverNoPrefix ? 
              '✅ All users can now use commands without prefix in this server' : 
              '❌ Users now need to use prefix or be in the no-prefix list'}`
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
      }

      if (action === "list") {
        if (!guildData.noPrefixUsers || guildData.noPrefixUsers.length === 0) {
          const embed = new EmbedBuilder()
            .setColor(client.config.color || '#FF66CC')
            .setAuthor({
              name: `${guild.name} No-Prefix Users`,
              iconURL: guild.iconURL(),
            })
            .setDescription("No users are currently in the no-prefix list for this server.")
            .setFooter({
              text: `Requested by ${user.username}`,
              iconURL: user.avatarURL(),
            });

          if (isSlash) {
            return await interaction.reply({ embeds: [embed] });
          } else {
            return await client.message.send(message, { embeds: [embed] });
          }
        }

        const userList = await Promise.all(
          guildData.noPrefixUsers.map(async (userId, index) => {
            const fetchedUser = await client.users.fetch(userId).catch(() => null);
            if (!fetchedUser) return `${index + 1}. Unknown User (${userId})`;
            return `${index + 1}. **${fetchedUser.globalName || fetchedUser.username}** (${fetchedUser.id})`;
          })
        );

        const embed = new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setAuthor({
            name: `${guild.name} No-Prefix Users`,
            iconURL: guild.iconURL(),
          })
          .setDescription(userList.join('\n'))
          .setFooter({
            text: `Total: ${guildData.noPrefixUsers.length} users | Requested by ${user.username}`,
            iconURL: user.avatarURL(),
          });

        if (isSlash) {
          return await interaction.reply({ embeds: [embed] });
        } else {
          return await client.message.send(message, { embeds: [embed] });
        }
      }

      if (["add", "remove"].includes(action)) {
        if (!targetUser) {
          const errorMessage = "Please mention a valid user or provide a valid user ID.";
          if (isSlash) {
            return await interaction.reply({ content: errorMessage, flags: 64 });
          } else {
            return await client.message.send(message, { content: errorMessage });
          }
        }

        if (action === "add") {
          if (guildData.noPrefixUsers.includes(targetUser.id)) {
            const embed = new EmbedBuilder()
              .setColor(client.config.color || '#FF66CC')
              .setAuthor({
                name: `${guild.name} No-Prefix Settings`,
                iconURL: guild.iconURL(),
              })
              .setDescription(
                `**${targetUser.globalName || targetUser.username}** is already in the no-prefix list for this server.`
              )
              .setFooter({
                text: `Actioned by ${user.username}`,
                iconURL: user.avatarURL(),
              });

            if (isSlash) {
              return await interaction.reply({ embeds: [embed] });
            } else {
              return await client.message.send(message, { embeds: [embed] });
            }
          }

          guildData.noPrefixUsers.push(targetUser.id);
          await guildData.save();

          const embed = new EmbedBuilder()
            .setColor(client.config.color || '#FF66CC')
            .setAuthor({
              name: `${guild.name} No-Prefix Settings`,
              iconURL: guild.iconURL(),
            })
            .setDescription(
              `✅ **${targetUser.globalName || targetUser.username}** has been added to the no-prefix list for this server.`
            )
            .setFooter({
              text: `Actioned by ${user.username}`,
              iconURL: user.avatarURL(),
            })
            .setTimestamp();

          if (isSlash) {
            return await interaction.reply({ embeds: [embed] });
          } else {
            return await client.message.send(message, { embeds: [embed] });
          }
        }

        if (action === "remove") {
          if (!guildData.noPrefixUsers.includes(targetUser.id)) {
            const embed = new EmbedBuilder()
              .setColor(client.config.color || '#FF66CC')
              .setAuthor({
                name: `${guild.name} No-Prefix Settings`,
                iconURL: guild.iconURL(),
              })
              .setDescription(
                `**${targetUser.globalName || targetUser.username}** is not in the no-prefix list for this server.`
              )
              .setFooter({
                text: `Actioned by ${user.username}`,
                iconURL: user.avatarURL(),
              });

            if (isSlash) {
              return await interaction.reply({ embeds: [embed] });
            } else {
              return await client.message.send(message, { embeds: [embed] });
            }
          }

          guildData.noPrefixUsers = guildData.noPrefixUsers.filter(id => id !== targetUser.id);
          await guildData.save();

          const embed = new EmbedBuilder()
            .setColor(client.config.color || '#FF66CC')
            .setAuthor({
              name: `${guild.name} No-Prefix Settings`,
              iconURL: guild.iconURL(),
            })
            .setDescription(
              `❌ **${targetUser.globalName || targetUser.username}** has been removed from the no-prefix list for this server.`
            )
            .setFooter({
              text: `Actioned by ${user.username}`,
              iconURL: user.avatarURL(),
            })
            .setTimestamp();

          if (isSlash) {
            return await interaction.reply({ embeds: [embed] });
          } else {
            return await client.message.send(message, { embeds: [embed] });
          }
        }
      }

    } catch (error) {
      console.error("Error in noprefix command:", error);
      const errorMessage = "An error occurred while executing this command.";

      if (interaction) {
        return await interaction.reply({ content: errorMessage, flags: 64 });
      } else {
        return await client.message.send(message, { content: errorMessage });
      }
    }
  },
};
