const userRegistration = require("../models/key.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const coinNameList = require("../models/coinnames.js");
const request = require("request");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("내자산")
    .setDescription("자신이 보유하고있는 코인을 확인합니다."),
  async execute(interaction) {
    function getCoinPrice(searchCoinPrice) {
      return new Promise((resolve, reject) => {
        const url = `https://api.upbit.com/v1/ticker?markets=KRW-${searchCoinPrice}`;
        request(url, { json: true }, (err, res, body) => {
          const price = body[0].trade_price;
          if (err || res.statusCode !== 200) {
            return reject(new Error("Failed to fetch data from the API"));
          }
          if (!Array.isArray(body) || body.length === 0) {
            return reject(new Error("The API response is not an array or it is empty"));
          }
          const priceData = body[0];
          if (
            typeof priceData !== "object" ||
            priceData === null ||
            !priceData.hasOwnProperty("trade_price")
          ) {
            return reject(new Error("Invalid or missing 'trade_price' in the API response"));
          }
          resolve(price);
        });
      });
    }
    const userData = await userRegistration.findOne({ name: interaction.user.id });
    const userCoinData = userData.coins;
    const coinPricesPromises = userCoinData.map((coin) => getCoinPrice(coin.coinName));
    const coinPrices = await Promise.all(coinPricesPromises);
    let totalAssets = userData.Money;
    const coinListEmbed = new EmbedBuilder()
      .setColor(0x79cf9f)
      .setTitle(`${interaction.user.username}님의 보유코인`)
      .setDescription("보유중인 모든 코인의 정보를 보여줍니다.")
      .setTimestamp();
    async function addCoinDataToEmbed(coinData, coinPrices) {
      coinData.forEach((coin, index) => {
        try {
          const price = coinPrices[index]; // 각 코인의 가격을 가져옵니다.
          const 개별코인가격 = price * coin.amount;
          const coinValue = price * coin.amount;
          totalAssets += coinValue; // 총 자산에 각 코인의 가치를 더합니다.

          const coinNameInKorean = coinNameList[coin.coinName] || coin.coinName;
          coinListEmbed.addFields({
            name: `${coinNameInKorean} (${coin.amount.toFixed(2)}개)`,
            value: `${개별코인가격.toLocaleString()}원`,
            inline: true,
          });
        } catch (error) {
          console.error(`Error fetching price for ${coin.coinName}:`, error);
          coinListEmbed.addFields({
            name: `${coin.coinName} 가격 조회 실패`,
            value: "가격 정보를 가져오는 데 실패했습니다.",
            inline: true,
          });
        }
      });
    }

    // 코인 데이터를 Embed에 추가
    await addCoinDataToEmbed(userCoinData, coinPrices);

    coinListEmbed.addFields({
      name: `보유자산 (현금) ${userData.Money.toFixed(3)}₩`,
      value: " ",
    });

    // 총자산 항목을 Embed에 추가
    coinListEmbed.addFields({
      name: `총자산`,
      value: `${totalAssets.toFixed(3)}₩`,
      inline: false,
    });

    // 현금으로 시작하는 총 자산

    coinPrices.forEach((price, index) => {
      const coinAmount = userCoinData[index].amount;
      const coinValue = price * coinAmount;
      totalAssets += coinValue; // 각 코인의 가치를 총 자산에 더함
      // 코인의 시세를 Embed에 추가하는 로직도 여기에 포함시킬 수 있습니다.
    });

    // 총자산 항목을 Embed에 추가
    if (!userData) {
      interaction.reply(`${interaction.user}님은 등록되어있지 않습니다.`);
    } else {
      async function sendMessages() {
        await interaction.reply(`${interaction.user}님의 코인조회를 시작합니다!`);
        await interaction.editReply({ embeds: [coinListEmbed] });
      }
      sendMessages();
    }
  },
};
