const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
  name: "mines",
  aliases: ["sweeper-mines", "mine"],
  category: "Game",
  permission: "",
  desc: "Simple Minesweeper Game",
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
      const gridSize = 3;
      const mines = 2;
      let revealedCells = new Set();
      let gameEnded = false;

      // Generate mine positions
      const minePositions = new Set();
      while (minePositions.size < mines) {
        const pos = Math.floor(Math.random() * (gridSize * gridSize));
        minePositions.add(pos);
      }

      const createButtons = () => {
        const rows = [];
        for (let i = 0; i < gridSize; i++) {
          const row = new ActionRowBuilder();
          for (let j = 0; j < gridSize; j++) {
            const position = i * gridSize + j;
            const button = new ButtonBuilder()
              .setCustomId(`mine_${position}`)
              .setStyle(revealedCells.has(position) 
                ? (minePositions.has(position) 
                  ? ButtonStyle.Danger 
                  : ButtonStyle.Success)
                : ButtonStyle.Secondary)
              .setLabel(revealedCells.has(position) 
                ? (minePositions.has(position) ? "💥" : "💎")
                : "?");

            if (gameEnded || revealedCells.has(position)) {
              button.setDisabled(true);
            }

            row.addComponents(button);
          }
          rows.push(row);
        }
        return rows;
      };

      const gameEmbed = new EmbedBuilder()
        .setTitle("💎 Mines Game 💣")
        .setDescription(`**Mines:** ${mines}\n**Safe Diamonds Left:** ${gridSize * gridSize - mines - revealedCells.size}`)
        .setColor("#FF66CC")
        .setFooter({ text: `Player: ${message.author.tag}` });

      const gameMessage = await message.reply({
        embeds: [gameEmbed],
        components: createButtons()
      });

      const collector = gameMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 300000
      });

      collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({
            content: "This is not your game!",
            ephemeral: true
          });
        }

        const position = parseInt(interaction.customId.split('_')[1]);

        if (minePositions.has(position)) {
          gameEnded = true;
          minePositions.forEach(pos => revealedCells.add(pos));

          gameEmbed.setDescription("💥 **BOOM! You hit a mine!**").setColor("#FF0000");
          collector.stop();
        } else {
          revealedCells.add(position);

          if (revealedCells.size === gridSize * gridSize - mines) {
            gameEnded = true;
            gameEmbed.setDescription("🎉 **WINNER! You found all diamonds!**").setColor("#00FF00");
            collector.stop();
          } else {
            gameEmbed.setDescription(`**Mines:** ${mines}\n**Safe Diamonds Left:** ${gridSize * gridSize - mines - revealedCells.size}`);
          }
        }

        await interaction.update({
          embeds: [gameEmbed],
          components: createButtons()
        });
      });

      collector.on('end', () => {
        if (!gameEnded) {
          gameEmbed.setDescription("⏰ **Game timed out!**");
          gameMessage.edit({
            embeds: [gameEmbed],
            components: []
          });
        }
      });

    } catch (error) {
      console.error("Error in mines command:", error);
      message.reply("An error occurred while starting the game.");
    }
  }
};