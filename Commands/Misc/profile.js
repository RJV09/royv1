const { EmbedBuilder } = require("discord.js");
const Badge = require("../../Models/badages"); // Adjust the path as needed
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
  name: "profile",
  description: "Display a user's profile with badges",
  category: "Misc",
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
    const targetUser =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author;

    // Fetch badges from the database
    const userBadges = await Badge.findOne({ userId: targetUser.id });

    const badges = userBadges?.badges || [];
    const badgesDisplay =
      badges.length > 0
        ? badges.join("\n")
        : "No badges assigned to this user.";

    // Create the embed
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.username}'s Profile`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`**Badges:**\n${badgesDisplay}`)
      .setColor(client.config.color)
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // Send the embed
    return message.channel.send({ embeds: [embed] });
  },
};
