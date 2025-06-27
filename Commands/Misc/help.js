const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
} = require("discord.js");

function tezz(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }
  return dp[m][n];
}

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "Misc",
  permission: "",
  desc: "Displays all available commands or details for a specific command",
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
  run: async ({ client, message, args, guildData, interaction }) => {
    try {
      const categoryEmojis = {
        Misc: "<:misc:1314603308018565180>",
        Music: "<:music:1314194882402717717>",
        Config: "<:config:1314603553964294144>",
        Filters: "<:filter:1314603987319918602>",
        Settings: "<:setting:1314604387187822665>",
        Games: "<a:games:1314604815065677878>",
      };
      const getCategories = () => {
        const categories = [...new Set(client.commands.map((c) => c.category))];
        return categories.filter(
          (category) => category && category.trim().length > 0
        );
      };
      const getCommandsByCategory = (category) =>
        client.commands.filter((c) => c.category === category);
      const getAllCommands = () =>
        client.commands.map((cmd) => ({
          name: cmd.name || "Unknown",
          category: cmd.category || "Uncategorized",
          desc: cmd.desc || "No description available",
          permission: cmd.permission || "",
          aliases: cmd.aliases || [],
        }));
      const searchCommands = (query) => {
        query = query.toLowerCase();
        const commands = getAllCommands();
        return commands.filter((cmd) => {
          if (cmd.name.toLowerCase() === query) return true;
          if (cmd.aliases.some((alias) => alias.toLowerCase() === query))
            return true;
          const nameDistance = tezz(query, cmd.name.toLowerCase());
          if (nameDistance <= 2) return true;
          if (cmd.name.toLowerCase().includes(query)) return true;
          if (cmd.desc.toLowerCase().includes(query)) return true;
          return false;
        });
      };
      if (args.length > 0) {
        const query = args.join(" ");
        const searchResults = searchCommands(query);
        const searchEmbed = new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setTitle(`Search Results for "${query}"`)
          .setDescription(
            searchResults.length > 0
              ? searchResults
                  .map(
                    (cmd) =>
                      `**${cmd.name}** ${
                        cmd.aliases.length > 0
                          ? `(${cmd.aliases.join(", ")})`
                          : ""
                      }\n` + `└ *${cmd.desc}*`
                  )
                  .join("\n\n")
              : "No commands found matching your search."
          )
          .setFooter({
            text: `Found ${searchResults.length} command${
              searchResults.length !== 1 ? "s" : ""
            }`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });

        return message.channel.send({ embeds: [searchEmbed] });
      }
      const MainEmbed = () => {
        return new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setAuthor({
            name: `${client.user.username} Help Menu`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `<a:penguinwave:1260899212439322708> **Welcome! <@${message.author.id}> to the Sofia Help Desk!**\n\n` +
              `<a:point:1264997528105910439> Prefix for this server is \`${guildData?.prefix || client.config.def_prefix}\`\n` +
              `<a:point:1264997528105910439> Search commands using \`${guildData?.prefix || client.config.def_prefix}help <query>\`\n` +
              `<a:point:1264997528105910439> Select categories from the dropdown menu`
          )
          .addFields(
            {
              name: "<a:stats:1314613869808717906> Stats",
              value: `Commands: ${client.commands.size} | Categories: ${
                getCategories().length
              }`,
              inline: false,
            },
            {
              name: "<a:search:1265017341947940995> Quick Search",
              value: `Use \`${guildData?.prefix || client.config.def_prefix}help <query>\` to search for commands!`,
              inline: false,
            }
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/1367550460927410176/1388137475377201252/standard_7.gif?ex=685fe344&is=685e91c4&hm=4498387d25f3c2563982b250dbd95fb2f6cc48da2b63e0699e8f17846ea22653&"
          )
          .setFooter({
            text: `Requested by ${
              message.author.globalName || message.author.tag
            }`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
      };
      if (args.length > 0) {
        const query = args.join(" ");
        const searchResults = searchCommands(query);
        const searchEmbed = new EmbedBuilder()
          .setColor(client.config.color || '#FF66CC')
          .setTitle(`Search Results for "${query}"`)
          .setDescription(
            searchResults.length > 0
              ? searchResults
                  .map(
                    (cmd) =>
                      `**${cmd.name}** ${
                        cmd.aliases.length > 0
                          ? `(${cmd.aliases.join(", ")})`
                          : ""
                      }\n` + `└ *${cmd.desc}*`
                  )
                  .join("\n\n")
              : "No commands found matching your search."
          )
          .setFooter({
            text: `Found ${searchResults.length} command${
              searchResults.length !== 1 ? "s" : ""
            }`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });
        return message.channel.send({ embeds: [searchEmbed] });
      }
      const createSelectMenu = () => {
        return new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("help_category_select")
            .setPlaceholder("Select a category")
            .addOptions(
              getCategories().map((category) => ({
                label: category,
                value: category,
                description: `View all ${category} commands`,
                emoji: categoryEmojis[category] || "📁",
              }))
            )
        );
      };
      const createMainButtons = () => {
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("help_home")
            .setLabel("Home")
            .setEmoji("1265005485216628818")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("help_search")
            .setLabel("Search")
            .setEmoji("1265017341947940995")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("all_commands")
            .setLabel("All Commands")
            .setEmoji("1265016484632199199")
            .setStyle(ButtonStyle.Secondary)
        );
      };
      const formatCommandList = () => {
        const categories = getCategories();
        return categories
          .map((category) => {
            const commands = getCommandsByCategory(category);
            const emoji = categoryEmojis[category] || "📁";
            return (
              `${emoji} **${category}**\n` +
              commands.map((cmd) => `\`${cmd.name}\``).join(", ")
            );
          })
          .join("\n\n");
      };
      const helpMessage = await message.channel.send({
        embeds: [MainEmbed()],
        components: [createSelectMenu(), createMainButtons()],
      });
      const collector = helpMessage.createMessageComponentCollector({
        time: 120000,
      });
      collector.on("collect", async (interaction) => {
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({
            content: "This help menu is not for you!",
            flags: 64,
          });
        }
        try {
          if (interaction.isButton()) {
            if (interaction.customId === "help_home") {
              await interaction.update({
                embeds: [MainEmbed()],
                components: [createSelectMenu(), createMainButtons()],
              });
            } else if (interaction.customId === "all_commands") {
              const allCommandsEmbed = new EmbedBuilder()
                .setColor(client.config.color || '#FF66CC')
                .setTitle("All Commands")
                .setDescription(formatCommandList())
                .setFooter({
                  text: `Requested by ${
                    message.author.globalName || message.author.tag
                  }`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setImage(
                  "https://cdn.discordapp.com/banners/1166742072070512640/25a4be982a319955d5911dd329d093e8.png?size=4096"
                );
              await interaction.update({
                embeds: [allCommandsEmbed],
                components: [createSelectMenu(), createMainButtons()],
              });
            } else if (interaction.customId === "help_search") {
              let searchEmbed = new EmbedBuilder()
                .setColor(client.config.color || '#FF66CC')
                .setTitle("Search Commands")
                .setDescription(
                  "- Enter a command name or category to search in the help menu."
                )
                .setFooter({
                  text: `Requested by ${
                    message.author.globalName || message.author.tag
                  }`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                });
              
              try {
                const searchMessage = await interaction.update({
                  embeds: [searchEmbed],
                  components: [],
                });
                
                const filter = (m) => m.author.id === message.author.id;
                const searchCollector = message.channel.createMessageCollector({
                  filter,
                  time: 30000,
                });
                
                searchCollector.on("collect", async (msg) => {
                  const query = msg.content.trim();
                  const searchResults = searchCommands(query);
                  searchEmbed = new EmbedBuilder()
                    .setColor(client.config.color || '#FF66CC')
                    .setTitle(`Search Results for "${query}"`)
                    .setDescription(
                      searchResults.length > 0
                        ? searchResults
                            .map(
                              (cmd) =>
                                `<a:point:1264997528105910439> **${cmd.name}** ${
                                  cmd.aliases.length > 0
                                    ? `(${cmd.aliases.join(", ")})`
                                    : ""
                                }\n` + `└ *${cmd.desc}*`
                            )
                            .join("\n\n")
                        : "No commands found matching your search."
                    )
                    .setFooter({
                      text: `Found ${searchResults.length} command${
                        searchResults.length !== 1 ? "s" : ""
                      }`,
                      iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    });
                  try {
                    await helpMessage.edit({ embeds: [searchEmbed] });
                  } catch (error) {
                    console.error("Error editing search message:", error);
                  }
                  searchCollector.stop();
                });
                
                searchCollector.on("end", (t, r) => {
                  const content =
                    r === "time"
                      ? "Session expired! Please run Help command again."
                      : "Search cancelled!";
                  helpMessage.edit({ components: [] }).catch(console.error);
                });
              } catch (error) {
                console.error("Error in search functionality:", error);
              }
            }
          } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "help_category_select") {
              const category = interaction.values[0];
              const commands = getCommandsByCategory(category);
              const emoji = categoryEmojis[category] || "📁";
              const categoryEmbed = new EmbedBuilder()
              .setColor(client.config.color || '#FF66CC')
              .setTitle(`${emoji} ${category} Commands`)
              .setDescription(
                commands
                  .map((cmd) => {
                    const aliases = cmd.aliases || []; // Default to an empty array if undefined
                    return `<a:point:1264997528105910439> **${cmd.name}** ${
                      aliases.length > 0 ? `(${aliases.join(", ")})` : ""
                    }\n└ *${cmd.desc}*`;
                  })
                  .join("\n\n")
              )
              .setFooter({
                text: `${commands.length} commands in this category`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              });              
              await interaction.update({
                embeds: [categoryEmbed],
                components: [createSelectMenu(), createMainButtons()],
              });
            }
          }
        } catch (error) {
          console.error("Interaction error:", error);
          try {
            await interaction.reply({
              content: "An error occurred while processing your request.",
              flags: 64,
            });
          } catch (replyError) {
            console.error("Error sending error reply:", replyError);
          }
        }
      });
      collector.on("end", () => {
        helpMessage
          .edit({
            embeds: [MainEmbed()],
            components: [],
            content: "Help menu expired! Please run the command again.",
          })
          .catch(console.error);
      });
    } catch (error) {
      console.error("Command error:", error);
      message.channel
        .send("An error occurred while displaying the help menu.")
        .catch(console.error);
    }
  },
};
