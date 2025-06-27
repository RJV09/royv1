
const { EmbedBuilder } = require("discord.js");
const userSchema = require("../../Models/User");

module.exports = {
  name: "addnoprefix",
  aliases: ["anp", "addnp"],
  category: "Developers",
  permission: "",
  desc: "Add a user to the global no-prefix list",
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
    // Authorized users (same as in noprefix.js)
    const authorizedUsers = [
      "760143551920078861",
      "1034078615417131038",
      "1321349927749550106",
      "1341483618891206757"   
    ];

    if (!authorizedUsers.includes(message.author.id)) {
      return message.channel
        .send({ content: "You are not authorized to use this command." })
        .then((m) => setTimeout(() => m.delete(), 5000));
    }

    const getUser = async () => {
      const targetUser =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        (await client.users.fetch(args[0]).catch(() => null));
      
      if (!targetUser) {
        return client.cluster
          .broadcastEval(`this.users.cache.get('${args[0]}')`)
          .then((res) => res.find(Boolean));
      }
      return targetUser;
    };

    const user = await getUser();
    if (!user) {
      return message.channel.send({
        content: "Please mention a valid user or provide a valid user ID.",
      });
    }

    let userData = await userSchema.findOne({ id: user.id });
    if (!userData) {
      userData = new userSchema({ id: user.id, noPrefix: false });
    }

    if (userData.noPrefix) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Global No Prefix`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `**${
            user.globalName ? user.globalName : user.username
          }** is already in the Global No Prefix List`
        )
        .setColor(client.config.color)
        .setFooter({
          text: `Actioned by ${
            message.author.globalName || message.author.username
          }`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    userData.noPrefix = true;
    await userData.save();

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Global No Prefix`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `✅ **${
          user.globalName ? user.globalName : user.username
        }** has been added to the Global No Prefix List`
      )
      .setColor(client.config.color)
      .setFooter({
        text: `Actioned by ${
          message.author.globalName || message.author.username
        }`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
