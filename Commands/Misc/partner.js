const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "partner",
  aliases: ["partnerinfo"],
  category: "Misc",
  permission: "",
  desc: "Displays partner information",
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
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Glacier Website")
          .setStyle(5)
          .setURL("https://glacierhosting.com"), // अपनी वेबसाइट का URL डालें

        new ButtonBuilder()
          .setLabel("Bot Hosting Website")
          .setStyle(5)
          .setURL("https://glacierhosting.in/bot-hosting/"), // अपनी बोट होस्टिंग वेबसाइट का URL डालें

        new ButtonBuilder()
          .setLabel("Discord Server")
          .setStyle(5)
          .setURL("https://discord.gg/Qk4ZVucgns") // अपने डिस्कॉर्ड सर्वर का URL डालें
      );

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({
          name: `${client.user.username} Partner Info`,
          iconURL: client.user.displayAvatarURL(), // बॉट का लोगो दिखाने के लिए
        })
        .setTitle("Glacier Hosting is a leading Premium Quality Top-Level hosting service.")
        .setDescription(
          "Glacier offers reliable and flexible hosting solutions that cater to a wide range of needs. Their commitment to quality and customer satisfaction makes them an excellent choice."
        )
        .addFields(
          { name: "🚀 Enhanced Performance:", value: "Significant improvements in speed and responsiveness.", inline: false },
          { name: "🔐 Advanced Security:", value: "Upgraded security features to ensure your data remains safe and protected.", inline: false },
          { name: "💎 Customization Options:", value: "You can choose a customized paid plan or get your plan catered as per your needs.", inline: false }
        )
        .setFooter({
          text: `Requested by ${message.author.globalName || message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      return await client.message.send(message, { embeds: [embed], components: [row] });
    } catch (err) {
      console.error(err);
      await client.message.send(message, {
        content: "An error occurred while executing this command",
      });
    }
  },
};
