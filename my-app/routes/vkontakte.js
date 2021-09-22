const {VK} = require("vk-io");

const config = require("../tmp/config.json");

vk = new VK({ token: config.vkTokeSecret });

vk.updates.start(() => {
    return console.log("[BOT] Состояние: trure");
  });

module.exports = vk;