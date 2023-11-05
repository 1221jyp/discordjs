const { SlashCommandBuilder } = require("discord.js");
const request = require("request");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("이더리움")
    .setDescription("비트코인 종가(현재가)를 알려줍니다."),
  async execute(interaction) {
    const url = `https://api.upbit.com/v1/ticker?markets=KRW-ETH`;
    request(url, { json: true }, (err, res, body) => {
      const data = body;
      console.log(data[0].trade_price);
      interaction.reply(`현재 이더리움의 가격은'${data[0].trade_price}원'입니다.! `);
    });
  },
};
