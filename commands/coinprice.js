const { SlashCommandBuilder } = require("discord.js");
const request = require("request");
const coinNames = require("../models/coinnames.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인시세")
    .setDescription("비트코인 종가(현재가)를 알려줍니다."),
  async execute(interaction) {
    const url = `https://api.upbit.com/v1/ticker?markets=KRW-BTC`;
    request(url, { json: true }, (err, res, body) => {
      const data = body;
      console.log(data[0].trade_price);
      interaction.reply(`현재 비트코인의 가격은'${data[0].trade_price}원'입니다.`);
    });
  },
};
