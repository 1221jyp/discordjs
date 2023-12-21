const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const request = require("request");
const coinNameList = require("../models/coinnames.js");
const pages = {
  page1: Object.entries(coinNameList).slice(0, 10),
  page2: Object.entries(coinNameList).slice(10, 20),
  page3: Object.entries(coinNameList).slice(20, 30),
  page4: Object.entries(coinNameList).slice(30, 40),
  page5: Object.entries(coinNameList).slice(40, 50),
  page6: Object.entries(coinNameList).slice(50, 60),
  page7: Object.entries(coinNameList).slice(60, 70),
  page8: Object.entries(coinNameList).slice(70, 80),
  page9: Object.entries(coinNameList).slice(80, 90),
  page10: Object.entries(coinNameList).slice(90, 100),
  page11: Object.entries(coinNameList).slice(100, 110),
  page12: Object.entries(coinNameList).slice(110, 117),
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인목록")
    .setDescription("현재 봇에 등록되어있는 코인의 목록들을 제공합니다.")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The gif category")
        .setRequired(true)
        .addChoices(
          { name: "1페이지 1~10", value: "page1" },
          { name: "2페이지 11~20", value: "page2" },
          { name: "3페이지 21~30", value: "page3" },
          { name: "4페이지 31~40", value: "page4" },
          { name: "5페이지 41~50", value: "page5" },
          { name: "6페이지 51~60", value: "page6" },
          { name: "7페이지 61~70", value: "page7" },
          { name: "8페이지 71~80", value: "page8" },
          { name: "9페이지 81~90", value: "page9" },
          { name: "10페이지 91~100", value: "page10" },
          { name: "11페이지 101~110", value: "page11" },
          { name: "12페이지 111~117", value: "page12" }
        )
    ),
  async execute(interaction) {
    function getBitcoinPrice(searchCoinPrice) {
      return new Promise((resolve, reject) => {
        const url = `https://api.upbit.com/v1/ticker?markets=KRW-${searchCoinPrice}`;
        request(url, { json: true }, (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body[0].trade_price);
          }
        });
      });
    }
    const category = interaction.options.getString("category").toString();
    const pagenumber = category.substr(4);
    const coinListEmbed = new EmbedBuilder()
      .setColor(0x79cf9f)
      .setTitle(`코인 목록`)
      .setDescription(`${pagenumber}페이지`)
      .setTimestamp();

    for (const [coin, coinNameInKorean] of pages[category]) {
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
