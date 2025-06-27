const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  
  module.exports = {
    name: "serverbanner",
    aliases: ["sb", "guildbanner"],
    category: "Misc",
    permission: "",
    desc: "Get the Banner of the Server",
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
    run: async ({ client, message }) => {
      try {
        const guild = message.guild;
  
        if (!guild.banner) {
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF66CC")
            .setAuthor({
              name: "No Server Banner",
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription("This server does not have a banner set.")
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            });
          return await message.reply({ embeds: [errorEmbed] });
        }
  
        const bannerUrl = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${
          guild.banner.startsWith("a_") ? "gif" : "png"
        }?size=1024`;
  
        const embed = new EmbedBuilder()
          .setColor(client.config.color)
          .setAuthor({
            name: `${guild.name}'s Banner`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setImage(bannerUrl)
          .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
  
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("View Original")
            .setStyle(ButtonStyle.Link)
            .setURL(bannerUrl),
          new ButtonBuilder()
            .setCustomId("download")
            .setLabel("Download")
            .setStyle(ButtonStyle.Primary)
        );
  
        await message.reply({ embeds: [embed], components: [row] });
      } catch (error) {
        console.error("Error in serverbanner command:", error);
        await message.reply(
          "An error occurred while processing your request. Please try again later."
        );
      }
    },
  };
  