const {VK, Context} = require("vk-io");

const config = require("../cnfg/config.json");

const vk = new VK({ token: config.tokenVk });

vk.updates.start(() => {
    return console.log("[BOT] Состояние: trure");
  });

module.exports = vk;