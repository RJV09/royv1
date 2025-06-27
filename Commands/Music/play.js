const guildSchema = require("../../Models/Guild");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  desc: "Play a song of your favorite choice",
  dev: false,
  options: {
    owner: false,
    inVc: true,
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
      if (!message.member.voice.channel) {
        const payload = {
          content: "- You need to be in a **voice channel** to play music.",
        };
        return client.message.send(message, payload);
      }
      const guildData = await guildSchema.findOneAndUpdate(
        { id: message.guild.id },
        { $setOnInsert: { id: message.guild.id, prefix: "?" } },
        { upsert: true, new: true, setDefaultsOnInsert: true, lean: true }
      );
      let prefix = guildData.prefix ?? `?`;
      const botMember = message.guild.members.me;
      if (botMember.voice.serverMute) {
        const payload = {
          content:
            `- I cannot play music because I am muted. Use ${prefix} join and unmute me to listen to music.`,
        };
        return client.message.send(message, payload);
      }

      // Handle slash command options
    if (interaction && interaction.options) {
      const query = interaction.options.getString('query');
      if (query) {
        args = [query];
      }
    }

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setAuthor({
          name: `Sofia Play`,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setDescription(`Please Provide A **Song Name** Or **Song URL** To Play`);
      return message.reply({ embeds: [embed] });
    }
      const query = args.join(" ");
      if (!query) {
        const payload = {
          content:
            "- Please provide a song name or URL to play. Example: `play Faded`",
        };
        return await client.message.send(message, payload);
      }
      await client.music.Play(message, query);
    } catch (error) {
      console.error(error);
      // const payload = {
      //   content:
      //     "- An error occurred while playing the song. Try Reporting it to the Developer [Team sofia](<https://discord.gg/S5zmG2RtJ3>)",
      // };
      // return await client.message.send(message, payload);
    }
  },
};