const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { inspect } = require("util");
const statsHelper = require("../../Structures/member"); // Update this path as needed.

module.exports = {
  name: "eval",
  aliases: ["jsk"],
  category: "",
  dev: true,
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
    const authorizedUsers = ["760143551920078861", "1034078615417131038", "1321349927749550106", "222167264768688128"];
    if (!authorizedUsers.includes(message.author.id)) {
      return message.channel
        .send({ content: "You are not authorized to use this command." })
        .then((m) => setTimeout(() => m.delete(), 5000));
    }

    const code = args.join(" ");
    if (!code) {
      return message.channel
        .send({ content: "Please provide code to evaluate." })
        .then((m) => setTimeout(() => m.delete(), 5000));
    }

    let evaled;
    try {
      const startTime = Date.now();
      evaled = eval(code);
      if (evaled instanceof Promise) evaled = await evaled;

      const additionalUsers = statsHelper.getAdditionalUsers();
      const realUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
      const totalUsers = realUsers + additionalUsers;

      let evaledString = inspect(evaled, { depth: 1 });
      evaledString = evaledString
        .replace(client.token, "TOKEN")
        .replaceAll(realUsers.toString(), totalUsers.toString());

      const pages = [];
      const pageSize = 1900;
      for (let i = 0; i < evaledString.length; i += pageSize) {
        pages.push(evaledString.slice(i, i + pageSize));
      }

      let currentPage = 0;
      const executionTime = Date.now() - startTime;

      const createEmbed = () => {
        return new EmbedBuilder()
          .setAuthor({
            name: "Eval Results",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`\`\`\`js\n${pages[currentPage]}\n\`\`\``)
          .setColor(client.config.color || "#FF66CC")
          .addFields({
            name: "Execution Time",
            value: `${executionTime}ms`,
            inline: true,
          })
          .setFooter({ text: `Page ${currentPage + 1}/${pages.length}` })
          .setTimestamp();
      };

      const createButtons = () => {
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("◀️ Previous")
            .setStyle("Primary")
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("▶️ Next")
            .setStyle("Primary")
            .setDisabled(currentPage === pages.length - 1),
          new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("🗑️ Delete")
            .setStyle("Danger")
        );
      };

      const msg = await message.channel.send({
        embeds: [createEmbed()],
        components: [createButtons()],
      });

      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "next") currentPage++;
        if (interaction.customId === "prev") currentPage--;
        if (interaction.customId === "delete") {
          await msg.delete();
          return collector.stop();
        }

        await interaction.update({
          embeds: [createEmbed()],
          components: [createButtons()],
        });
      });

      collector.on("end", async () => {
        await msg.edit({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("delete")
                .setLabel("🗑️ Delete")
                .setStyle("Danger")
                .setDisabled(true)
            ),
          ],
        });
      });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Eval Error")
        .setColor(client.config.color || "#FF66CC")
        .setDescription(`\`\`\`js\n${error.toString()}\n\`\`\``)
        .setTimestamp();
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
