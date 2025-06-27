const Badge = require("../../Models/badages"); // Adjust path as needed

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

const badgeEmojiMap = {
  Owner: "<a:owner:1242145791599186030>",
  Developer: "<:developer:1248587616794968065>",
  "Co-Developer": "<:EARLY_VERIFIED_DEVELOPER:1259827675556745238>",
  Admim: "<:admin:1248588663819079680>",
  Supporter: "<:firsthoursupporter:1248592079622377492>",
  Mod: "<:mod:1248588844916277268>",
  Staff: "<:staffteam:1248593934033096726>",

  Vip: "<a:premiumuser:1257313018354728961>",
  Friend: "<:friends:1251803790806355988>",
  Bughunter: "<:bughunter:1248592762400411761>",
  Manager: "<:DISCORD_EMPLOYEE:1259827646154407936>",
  Special: "<a:owner:1261356052704788503>",
  Premuser: "<a:premium:1265001940622905395>",
  User: "<:ausers:1270978452253835315>",
};

module.exports = {
  name: "badge",
  description: "Add, remove, or list user badges",
  category: "",
  options: {
    owner: true,
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
    const action = args[0]?.toLowerCase();
    const badgeList = Object.keys(badgeEmojiMap);

    if (!action || !["add", "remove"].includes(action)) {
      return message.channel.send({
        content: "Usage: add-badge <add|remove|list> [@user|userId] [badge]",
      });
    }

    const getUser = async () => {
      const user =
        message.mentions.users.first() ||
        client.users.cache.get(args[1]) ||
        (await client.users.fetch(args[1]).catch(() => null));
      return user;
    };

    if (action === "add" || action === "remove") {
      const user = await getUser();
      const badge = args[2];

      if (!user) {
        return message.channel.send({
          content: "Please mention a valid user or provide a valid user ID.",
        });
      }

      if (!badgeList.includes(badge)) {
        return message.channel.send({
          content: `Invalid badge. Available badges: ${badgeList.join(", ")}`,
        });
      }

      const emojiBadge = `${badgeEmojiMap[badge]}・${badge}`;
      let userBadges = await Badge.findOne({ userId: user.id });

      if (!userBadges) {
        userBadges = new Badge({ userId: user.id, badges: [] });
      }

      if (action === "add") {
        if (userBadges.badges.includes(emojiBadge)) {
          return message.channel.send({
            content: `${client.emoji.cross} | User already has this badge.`,
          });
        }
        userBadges.badges.push(emojiBadge);
        await userBadges.save();

        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Badge System",
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${emojiBadge} badge has been added to **${
              user.globalName || user.username
            }**`
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
      } else if (action === "remove") {
        if (!userBadges.badges.includes(emojiBadge)) {
          return message.channel.send({
            content: `${client.emoji.cross} | User does not have this badge.`,
          });
        }
        userBadges.badges = userBadges.badges.filter(
          (b) => b !== emojiBadge
        );
        await userBadges.save();

        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Badge System",
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${emojiBadge} badge has been removed from **${
              user.globalName || user.username
            }**`
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
    }
  },
};
