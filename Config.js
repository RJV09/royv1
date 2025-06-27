
require('dotenv').config();

module.exports = {
  token: {
    Primary: process.env.PRIMARY_TOKEN,
    Secondary: process.env.SECONDARY_TOKEN,
  },
  tokenTopgg: process.env.TOPGG_TOKEN,
  mongoURL: {
    Primary: process.env.PRIMARY_MONGO_URL,
    Secondary: process.env.SECONDARY_MONGO_URL,
  },
  clusterMode: process.env.CLUSTER_MODE,
  def_prefix: process.env.DEFAULT_PREFIX,
  vote_bypass: process.env.VOTE_BYPASS_USERS ? process.env.VOTE_BYPASS_USERS.split(',') : [],
  vote: process.env.VOTE_URL,
  developers: process.env.DEVELOPERS ? process.env.DEVELOPERS.split(',') : [],
  managers: process.env.MANAGERS ? process.env.MANAGERS.split(',') : [],
  support: process.env.SUPPORT_SERVER,
  invite: process.env.INVITE_URL,
  color: process.env.BOT_COLOR || '#FF66CC',
  webhook: {
    guildAdd: process.env.WEBHOOK_URL,
    guildRemove: process.env.WEBHOOK_URL,
    commandRun: process.env.WEBHOOK_URL,
  },
  LOGGINGS: {
    guildAdd: process.env.WEBHOOK_URL,
    guildRemove: process.env.WEBHOOK_URL,
    commandRun: process.env.WEBHOOK_URL,
  },
  nodes: [
    {
      name: process.env.LAVALINK_HOST,
      url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
      auth: process.env.LAVALINK_PASSWORD,
      secure: false,
    },
  ],
};
