const { SlashCommandBuilder } = require("discord.js");
const request = require("request");
const coinNameList = require("../models/coinnames.js");

function convertKoreanToEnglish(koreanCoinName) {
  // 한글 이름을 키로 영문 이름을 값으로 가지는 맵을 생성합니다.
  const koreanToEnglishMap = Object.entries(coinNameList).reduce((map, [english, korean]) => {
    map[korean] = english;
    return map;
  }, {});

  // 한글 코인 이름으로 영문 코인 이름을 찾아 반환합니다.
  // 만약 해당하는 한글 코인 이름이 없다면 undefined를 반환합니다.
  return koreanToEnglishMap[koreanCoinName];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인조회")
    .setDescription("입력한 코인의 현재가를 알려줍니다.")
    .addStringOption((option) =>
      option
        .setName("종목명")
        .setDescription(
          "조회할 코인의 이름을 입력하세요. '/코인목록' 명령어를 통해 코인 목록을 확인하실 수 있습니다."
        )
    ),
  async execute(interaction) {
    const searchItem = interaction.options.getString("종목명");
    const englishCoinName = convertKoreanToEnglish(searchItem);
    if (!englishCoinName || !searchItem) {
      interaction.reply(`${interaction.user}, 시세조회에 실패했습니다. 정확한 코인명을 입력하세요`);
    } else {
      const url = `https://api.upbit.com/v1/ticker?markets=KRW-${englishCoinName}`;
      request(url, { json: true }, (err, res, body) => {
        const data = body;
        console.log(data[0].trade_price);
        interaction.reply(`현재 ${searchItem}의 가격은'${data[0].trade_price}원'입니다.`);
      });
    }
  },
};
