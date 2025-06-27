const Client = require("./Structures/client");
const { WebhookClient } = require("discord.js");

const log = (level, message) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
};

const errorWebhook = new WebhookClient({
  url:
    process.env.ERROR_WEBHOOK_URL ||
    "https://discord.com/api/webhooks/1387868568611192962/l7sNUXawii4OVfbUF01RdtzObmjAO_xzEhJqP_bGEWBVlDtVelh3J3DNqwISa2jDVgiB",
});

let client;
const metrics = {
  warnings: 0,
  errors: 0,
  guilds: 0,
  users: 0,
  channels: 0,
};
const handleError = (type, error) => {
  log("error", `${type}: ${error.message}`);
  metrics.errors++;
  errorWebhook
    .send(`${type}: ${error.message}`)
    .catch((e) =>
      log("error", `Failed to send error to webhook: ${e.message}`)
    );
};
process.on("warning", (warning) => {
  log("warn", `Warning: ${warning.name} - ${warning.message}`);
  metrics.warnings++;
});

process.on("unhandledRejection", (reason, promise) => {
  handleError(`Fullfilled Promise Rejection: ${reason.message}`, reason);
});

process.on("uncaughtException", (error) => {
  handleError("Uncaught Exception", error);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});
const shutdown = () => {
  log("info", "Received shutdown signal. Cleaning up raws and exiting");
  client.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Initialize client after error handlers are set up
client = new Client();

client.on("ready", () => {
  log("info", `Bot is ready! Logged in as ${client.user.tag}`);
  updateMetrics();
});

client.on("error", (error, id) => {
  handleError(`Type ${id} Error\n ${error.message}`, error);
  if (id) {
    log("error", `Error occurred in cluster ${id}`);
  }
});
const clusterEval = async (fn) => {
  if (client.cluster && client.cluster.broadcastEval) {
    const results = await client.cluster.broadcastEval(fn);
    return results.reduce((prev, val) => prev + val, 0);
  }
  return 0;
};
const updateMetrics = async () => {
  try {
    if (client.cluster && client.cluster.broadcastEval) {
      metrics.guilds = await clusterEval((c) => c.guilds.cache.size);
      metrics.users = await clusterEval((c) => c.users.cache.size);
    } else {
      metrics.guilds = client.guilds.cache.size;
      metrics.users = client.users.cache.size;
    }
  } catch (error) {
    log("error", `Failed to update metrics: ${error.message}`);
  }
};

setInterval(updateMetrics, 60000);
client.ryzenBuild();
const isProduction = process.env.MODE === "production";
if (!isProduction) {
  log("info", "Running in development mode");
}
module.exports = { client };