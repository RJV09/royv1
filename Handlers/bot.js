const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const GuildSchema = require("../Models/Guild");

module.exports = async function ryzenDispatcher(client, kazagumo) {
  kazagumo.on("playerStart", async (player, track) => {
    if (track.length < 5000) {
      player.skip();
      let channel = client.channels.cache.get(player.textId);
      if (channel) {
        const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`- Track is less than **5 seconds.** Skipping the track.`);
      channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => msg.delete(), 5000));
    }
      return;
    }
    let guildData = await GuildSchema.findOne({ id: player.guildId });
    const channel = client.channels?.cache.get(player.textId);
   /* let data = await client.spotify.searchTrack(track.title);
    let title, author, thumbnail, url, artistLink;
    let tezz = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (tezz.test(track.uri)) {
      title = data.title
        ? data.title.replace(/[^a-zA-Z0-9 ]/g, "")
        : track.title.replace(/[^a-zA-Z0-9 ]/g, "");
      author = data.artist ? data.artist : client.user.username;
      thumbnail = data.thumbnail ? data.thumbnail : track.thumbnail;
      url = data.link ? data.link : track.uri;
      artistLink = data.artistLink ? data.artistLink : track.uri;
    } else {
      title = track.title;
      author = track.author;
      thumbnail = track.thumbnail;
      url = track.uri;
      artistLink = data.artistLink ? data.artistLink : track.uri;
    } */
  // player.queue.current.title = title;
  // player.data.set("url", url);
    player.data.set("autoplayTrack", track);
    // let ops = track.requester.globalName ?? track.requester.username;
    let ops = `[**${
      track.requester.globalName
        ? track.requester.globalName
        : track.requester.username
    }**](https://discord.com/users/${track.requester.id})`;

    client.utils.setVCStatus(
      player.voiceId,
      `<a:music:1265005782509031586> ${track.title} by ${track.author}`
    );
    const nowPlaying = new EmbedBuilder()
      .setAuthor({
        name: `Now Playing`,
        iconURL:
          "https://images-ext-1.discordapp.net/external/EDzrNAEe3DIlL_z46TeIqhL-jYW9uCppxWahLiVi86g/https/cdn.discordapp.com/emojis/1314189382684770354.gif" ??
          track.requester.displayAvatarURL({ dynamic: true }),
        url: track.uri,
      })
      .setColor(client.config.color)
      .setThumbnail(track.thumbnail)
      .addFields(
        {
          name: "<a:music1:1314190805153480774> Chosen by",
          value: ops,
          inline: true,
        },
        {
          name: "<a:duration:1314189816153374841> Duration",
          value: track.isStream
            ? "Live"
            : await client.utils.convertTime(track.length),
          inline: true,
        }
      )
      .setFooter({
        text: `Autoplay - ${
          guildData.settings.autoplay ? "Enabled" : "Disabled"
        } ⁠・ Volume - ${player.volume}% ⁠・ Queue - ${player.queue.length}`,
        iconURL: track.requester.displayAvatarURL({ dynamic: true }),
      });
    const buttonsRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(client.btn.grey),
      new ButtonBuilder()
        .setCustomId("PauseAndResume")
        .setLabel("Pause")
        .setStyle(client.btn.grey),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(client.btn.red),
      new ButtonBuilder()
        .setCustomId("settings")
        .setLabel("Settings")
        .setStyle(client.btn.grey),
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(client.btn.grey)
    );
    const buttonsRow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("like")
        .setLabel("Like Track")
        .setEmoji("1314664788403687467")
        .setStyle(client.btn.green),
      new ButtonBuilder()
        .setCustomId("music_invite")
        .setLabel("Invite Friend")
        .setEmoji("1314665215689756735")
        .setStyle(client.btn.blue),
      new ButtonBuilder()
        .setCustomId("lyrics")
        .setLabel("Lyrics")
        .setEmoji("1314665639990001756")
        .setStyle(client.btn.blue)
    );

    if (player.volume > 100) {
      nowPlaying.setDescription(
        `**[${
          track.title.length > 30 ? `${track.title.slice(0, 30)}...` : track.title
        }](${track.uri})** by [**${track.author}**](${track.uri})\n-# **Note:** *Volume is slightly higher then usual, may cause distortion*`
      );
      //   \n- **Duration** \`(${
      //     track.isStream ? "Live" : await client.utils.convertTime(track.length)
      //   })\`\n-# Note: Volume is slightly higher then usual, may cause distortion`
      // );
    } else {
      nowPlaying.setDescription(
        `**[${
          track.title.length > 30 ? `${track.title.slice(0, 30)}...` : track.title
        }](${track.uri})** by [**${track.author}**](${track.uri})`
      );
      // <:sia_DotBlue:1068413440672149545> **Duration** \`(${track.isStream ? "Live" : await client.utils.convertTime(
      //   track.length
      // )})\``
    }
    if (channel) {
      await channel
        ?.send({ embeds: [nowPlaying], components: [buttonsRow, buttonsRow2] })
        .then((msg) => player.data.set("message", msg));
    } else {
      player.destroy();
      let channelGuild = client.guilds.cache.get(player.guildId);
      let channels = channelGuild.channels.cache.filter(
        (c) => c.type === ChannelType.GuildText
      );
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("I can't find the text channel to send the message. Destroying the player.");
      await client.channels.cache
        .get(channels.first().id)
        .send({ embeds: [embed] })      
        .then((msg) => setTimeout(() => msg.delete(), 8000))
        .catch((err) => console.error(err));
    }
  });
  kazagumo.on("playerEnd", async (player) => {
    const msg = player.data.get("message").id;
    const channel = client.channels.cache.get(player.textId);
    if (channel) {
      if (channel.messages.cache.get(msg)) {
        channel.messages.cache.get(msg).delete();
      }
    }
  });
  kazagumo.on("playerClosed", async (player, track) => {
    const channel = client.channels?.cache.get(player.textId);
    if (channel) {
      channel.messages.fetch(player.data.get("message")).then((msg) => {
        msg.delete();
      });
    }
  });
  kazagumo.on("playerEmpty", async (player) => {
    let prefix = await client.utils.getPrefix(player.guildId);
    client.utils.setVCStatus(
      player.voiceId,
      `${prefix ?? "?"}play <song name> And Enjoy!`
    );
    player.data.get("message")?.delete();
    let data = await GuildSchema.findOne({ id: player.guildId });
    if (data && data?.settings.autoplay) {
      client.utils.sofiaAutoplay(player, player.data?.get("url"));
    } else {
      const embed = new EmbedBuilder().setColor(client.config.color).setAuthor({
        name: `No more tracks in the queue. Leaving the voice channel.`,
        iconURL: client.user.avatarURL(),
      });
      const channel = client.channels.cache.get(player.textId);
      channel
        .send({ embeds: [embed] })
        .then((msg) => setTimeout(() => msg.delete(), 80000 * 10 * 2));
    }
  });
  kazagumo.on("playerDestroy", async (player) => {
    client.utils.removeVCStatus(player.voiceId);
    try {
      let data = await GuildSchema.findOne({ id: player.guildId });
      let shard = await client.guilds.cache.get(data.id).shardId;
      if (data.twentyFourSeven.enabled) {
        await client.kazagumo.createPlayer({
          guildId: data.id,
          textId: data.twentyFourSeven.textChannel,
          voiceId: data.twentyFourSeven.voiceChannel,
          shardId: shard,
          deaf: true,
        });
      }
      if (!player) return;
      if (!player && !player.playing) return;
      const msg = player.data.get("message")
        ? player.data.get("message").id
        : null;
      if (!msg) return;
      const channel = client.channels.cache.get(player.textId);
      if (channel) {
        if (channel.messages.cache.get(msg)) {
          channel.messages.cache.get(msg).delete();
        }
      }
    } catch (e) {
      const player = client.kazagumo.players.get(player.guildId);
      player.destroy();
    }
  });
  kazagumo.on("playerMoved", async (player, state, channels) => {
    client.utils.removeVCStatus(player.voiceId);
    try {
      const newChannel = client.channels.cache.get(channels.newChannelId);
      const oldChannel = client.channels.cache.get(channels.oldChannelId);
      let channel = client.channels.cache.get(player.textId);
      if (channels.newChannelId === channels.oldChannelId) return;
      if (!channel) return;
      if (state === "UNKNOWN") {
        player.destroy();
        embedMessage = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription("Unable to move to the new channel. Destroying the player.");
      return channel.send({ embeds: [embedMessage] }).then((msg) => setTimeout(() => msg.delete(), 8000));
    }
      if (state === "MOVED") {
        // player.queue.clear();
        // player.skip();
        player.setVoiceChannel(channels.newChannelId);
        if (player.paused) player.pause(false);
        embedMessage = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`Moved from **${oldChannel.name}** to **${newChannel.name}**.`);
      return channel.send({ embeds: [embedMessage] }).then((msg) => setTimeout(() => msg.delete(), 8000));
    }
      if (state === "LEFT") {
        let data = await GuildSchema.findOne({ id: player.guildId });
        if (channels.newChannel) {
          player.setVoiceChannel(channels.newChannelId);
        } else {
          if (player) player.destroy();
          let shard = await client.guilds.cache.get(data.id).shardId;
          if (data.twentyFourSeven.enabled) {
            setTimeout(async () => {
              await client.kazagumo.createPlayer({
                guildId: data.id,
                textId: data.twentyFourSeven.textChannel,
                voiceId: data.twentyFourSeven.voiceChannel,
                shardId: shard,
                deaf: true,
              });
            }, 3000);
          } else {
            if (player) player.destroy();
            const oldChannel = client.channels.cache.get(channels.oldChannelId);
            embedMessage = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(`I have been left from **${oldChannel.name}**. Destroying the player.`);
          return channel.send({ embeds: [embedMessage] }).then((msg) => setTimeout(() => msg.delete(), 8000));
        }
        }
      }
    } catch (e) {
      const player = client.kazagumo.players.get(player.guildId);
      player.destroy();
    }
  });
  kazagumo.on("playerStuck", async (player, data) => {
    client.utils.removeVCStatus(player.voiceId);
    const channel = client.channels.cache.get(player.textId);
    let msg = player.data.get("message").id;
    if (channel) {
      if (channel.messages.cache.get(msg)) {
        channel.messages.cache.get(msg).delete();
      }
    }
    console.warn(
      `Track is stuck for more than ${data.threshold}ms. Skipping the track in ${player.guildId}`
    );
    if (channel) {
      embedMessage = new EmbedBuilder()
      .setColor(client.config.color)
      .setDescription(`Track is stuck for more than ${data.threshold}ms. Skipping the track.`);
    return channel.send({ embeds: [embedMessage] }).then((msg) => setTimeout(() => msg.delete(), 8000));
  }
      player.skip();
    }
  );
};