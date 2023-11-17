const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const request = require("request");
const coinNameList = require("../models/coinnames.js");
const page1 = Object.entries(coinNameList).slice(0, 10);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인목록")
    .setDescription("현재 봇에 등록되어있는 코인의 목록들을 제공합니다."),
  async execute(interaction) {
    function getBitcoinPrice(searchCoinPrice) {
      return new Promise((resolve, reject) => {
        const url = `https://api.upbit.com/v1/ticker?markets=KRW-${searchCoinPrice}`;
        request(url, { json: true }, (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            console.log(body);
            resolve(body[0].trade_price);
          }
        });
      });
    }

    const coinListEmbed = new EmbedBuilder()
      .setColor(0x79cf9f)
      .setTitle(`코인 목록`)
      .setDescription("1페이지")
      .setTimestamp();

    for (const [coin, coinNameInKorean] of page1) {
      try {
        const price = await getBitcoinPrice(coin);
        coinListEmbed.addFields({
          name: "```" + `${coinNameInKorean} ` + "```" + " " + "```" + `${price}원` + "```",
          value: ` `,
        });
      } catch (err) {
        console.error(err);
      }
    }

    await interaction.reply({ embeds: [coinListEmbed] });
  },
};
