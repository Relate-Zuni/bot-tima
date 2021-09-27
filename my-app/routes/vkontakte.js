const { VK } = require("vk-io");

const config = require("../tmp/config.json");

vk = new VK({ token: config.vkTokeSecret });

vk.updates
  .start()
  .then((results) => {
    return console.log("Bot started!");
  })
  .catch((error) => {
    return console.log(error);
  });

module.exports = vk;
