const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const axios = require("axios");
  
  async function getUserBannerFromAxios(userId, client) {
    try {
      const response = await axios.get(
        `https://discord.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bot ${client.config.token.Primary}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
  
  module.exports = {
    name: "banner",
    aliases: ["ub", "profilebanner"],
    category: "Misc",
    permission: "",
    desc: "Get the Banner of a User",
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
        let user =
          message.mentions.users.first() ||
          (await client.users.fetch(args[0]).catch(() => null)) ||
          message.author;
  
        let userBannerData = await getUserBannerFromAxios(user.id, client);
  
        if (!userBannerData || !userBannerData.banner) {
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF66CC")
            .setAuthor({
              name: "Unable to fetch banner",
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription("User has no banner set.")
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            });
          return await message.reply({ embeds: [errorEmbed] });
        }
  
        const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${
          userBannerData.banner
        }.${userBannerData.banner.startsWith("a_") ? "gif" : "png"}?size=1024`;
  
        const embed = new EmbedBuilder()
          .setColor(client.config.color)
          .setAuthor({
            name: `${user.username}'s Banner`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
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
        console.error("Error in banner command:", error);
        await message.reply(
          "An error occurred while processing your request. Please try again later."
        );
      }
    },
  };
  