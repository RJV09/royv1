const fs = require("fs").promises;
const path = require("path");
const { REST, Routes } = require("discord.js");

module.exports = class SlashLoader {
  constructor(client) {
    this.client = client;
    this.slashCommands = new Map();
    this.commandsDir = path.resolve("./Commands");
  }

  async loadSlashCommands() {
    try {
      const commands = [];
      const seenNames = new Set();
      const commandDirectories = await fs.readdir(this.commandsDir);

      for (const dir of commandDirectories) {
        const cmdPath = path.resolve(this.commandsDir, dir);
        const isDir = await this.isDirectory(cmdPath);

        if (isDir) {
          const commandFiles = await fs.readdir(cmdPath);

          for (const file of commandFiles) {
            if (file.endsWith(".js")) {
              const filePath = path.resolve(cmdPath, file);
              try {
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);

                if (command && command.name && command.run && typeof command.name === "string") {
                  const slashCommand = this.convertToSlashCommand(command);
                  const commandName = slashCommand.name.toLowerCase();

                  // Check for duplicate names
                  if (!seenNames.has(commandName)) {
                    seenNames.add(commandName);
                    commands.push(slashCommand);
                    this.slashCommands.set(command.name, command);

                    // Store aliases in internal map but don't register as separate slash commands
                    if (command.aliases && Array.isArray(command.aliases)) {
                      command.aliases.forEach(alias => {
                        this.slashCommands.set(alias, command);
                      });
                    }
                  } else {
                    console.log(`Skipping duplicate command: ${commandName} from file: ${file}`);
                  }
                }
              } catch (error) {
                console.error(`Failed to load slash command ${file}:`, error.message);
              }
            }
          }
        }
      }

      await this.registerSlashCommands(commands);
      console.log(`Loaded ${commands.length} slash commands`);
    } catch (error) {
      console.error("Error loading slash commands:", error);
    }
  }

  convertToSlashCommand(command) {
    // Normalize command name properly for slash commands
    let commandName = command.name.toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .replace(/[-_]{2,}/g, '-') // Replace multiple dashes/underscores with single dash
      .replace(/^[-_]|[-_]$/g, ''); // Remove leading/trailing dashes/underscores

    // Ensure name is between 1-32 characters
    if (commandName.length === 0) commandName = 'unknown';
    if (commandName.length > 32) commandName = commandName.slice(0, 32);

    const slashCommand = {
      name: commandName,
      description: (command.desc || "No description provided").slice(0, 100),
      options: []
    };

    // Music commands
    if (command.category === "Music") {
      if (["play", "search", "sprec", "sp"].includes(command.name)) {
        slashCommand.options.push({
          name: "query",
          description: "Song name, URL, or search query",
          type: 3, // STRING
          required: true
        });
      }

      if (["seek", "forward", "backward"].includes(command.name)) {
        slashCommand.options.push({
          name: "time",
          description: "Time in seconds",
          type: 4, // INTEGER
          required: true
        });
      }

      if (["move"].includes(command.name)) {
        slashCommand.options.push({
          name: "from",
          description: "Position to move from",
          type: 4, // INTEGER
          required: true
        }, {
          name: "to",
          description: "Position to move to",
          type: 4, // INTEGER
          required: true
        });
      }

      if (["loop"].includes(command.name)) {
        slashCommand.options.push({
          name: "mode",
          description: "Loop mode",
          type: 3, // STRING
          required: false,
          choices: [
            { name: "Off", value: "none" },
            { name: "Track", value: "track" },
            { name: "Queue", value: "queue" }
          ]
        });
      }
    }

    // Misc commands
    if (command.category === "Misc") {
      if (command.name === "help") {
        slashCommand.options.push({
          name: "command",
          description: "Specific command to get help for",
          type: 3,
          required: false,
        });
      }
      if (["avatar", "banner", "profile"].includes(command.name)) {
        slashCommand.options.push({
          name: "user",
          description: "User to get information for",
          type: 6, // USER
          required: false
        });
      }

      if (["prefix"].includes(command.name)) {
        slashCommand.options.push({
          name: "newprefix",
          description: "New prefix to set",
          type: 3, // STRING
          required: false
        });
      }

      if (["calclator"].includes(command.name)) {
        slashCommand.options.push({
          name: "expression",
          description: "Mathematical expression to calculate",
          type: 3, // STRING
          required: true
        });
      }
    }

    // Game/Action commands
    if (command.category === "Game" || command.category === "Games") {
      const actionCommands = ["hug", "kiss", "pat", "slap", "kick", "punch", "poke", "highfive", "cudles"];
      if (actionCommands.includes(command.name)) {
        slashCommand.options.push({
          name: "user",
          description: `User to ${command.name}`,
          type: 6, // USER
          required: false
        });
      }
    }

    // Filter commands
    if (command.category === "Filters") {
      if (["bassboost", "quality", "treblebass"].includes(command.name)) {
        slashCommand.options.push({
          name: "level",
          description: "Filter intensity level",
          type: 4, // INTEGER
          required: false,
          choices: [
            { name: "Low", value: 1 },
            { name: "Medium", value: 2 },
            { name: "High", value: 3 }
          ]
        });
      }
    }

    // Settings commands
    if (command.category === "Settings") {
      if (["247"].includes(command.name)) {
        slashCommand.options.push({
          name: "enable",
          description: "Enable or disable 24/7 mode",
          type: 5, // BOOLEAN
          required: false
        });
      }

      if (["autoplay"].includes(command.name)) {
        slashCommand.options.push({
          name: "enable",
          description: "Enable or disable autoplay",
          type: 5, // BOOLEAN
          required: false
        });
      }

      if (["ignorechannel"].includes(command.name)) {
        slashCommand.options.push({
          name: "channel",
          description: "Channel to ignore or unignore",
          type: 7, // CHANNEL
          required: false
        });
      }

      if (["server-volume"].includes(command.name)) {
        slashCommand.options.push({
          name: "volume",
          description: "Set server volume (0-200)",
          type: 4, // INTEGER
          required: true,
          min_value: 0,
          max_value: 200
        });
      }
    }

    return slashCommand;
  }

  async registerSlashCommands(commands) {
    if (!this.client.config?.token?.Primary) {
      console.error("No bot token found for slash command registration");
      return;
    }

    const rest = new REST({ version: "10" }).setToken(this.client.config.token.Primary);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationCommands(this.client.user.id),
        { body: commands }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error registering slash commands:", error);
    }
  }

  async isDirectory(path) {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  }

  getSlashCommand(name) {
    return this.slashCommands.get(name);
  }
};