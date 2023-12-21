const userRegistration = require("../models/key.js");
const { SlashCommandBuilder } = require("discord.js");
const coinNameList = require("../models/coinnames.js");
const userlist = require("../models/key.js");
const request = require("request");

function convertKoreanToEnglish(koreanCoinName) {
  // 한글 이름을 키로 영문 이름을 값으로 가지는 맵을 생성합니다.
  const koreanToEnglishMap = Object.entries(coinNameList).reduce((map, [english, korean]) => {
    map[korean] = english;
    return map;
  }, {});
  return koreanToEnglishMap[koreanCoinName];
}

function checkDecimalPlaces(value) {
  // 숫자를 문자열로 변환합니다.
  const valueAsString = value.toString();

  // 소수점 위치를 찾습니다.
  const decimalIndex = valueAsString.indexOf(".");

  // 소수점이 없거나 소수점 이후의 자릿수가 1자리 미만인 경우 false를 반환합니다.
  if (decimalIndex === -1 || valueAsString.length - decimalIndex - 1 <= 2) {
    return false;
  }

  // 그렇지 않으면 true를 반환합니다 (소수점 둘째 자리 이상).
  return true;
}

async function updateCoinAmount(userId, coinName, amountToSell, coinPrice) {
  try {
    const filter = { name: userId };
    const saleValue = coinPrice * amountToSell;

    // 먼저 코인 수량을 업데이트합니다.
    let update = {
      $inc: {
        "coins.$[elem].amount": -amountToSell,
        Money: saleValue,
      },
    };
    let options = {
      arrayFilters: [{ "elem.coinName": coinName }],
      new: true,
    };

    let updatedUser = await userlist.findOneAndUpdate(filter, update, options);

    // 코인 수량 업데이트 후, 해당 코인의 amount가 0인지 확인합니다.
    const coinIndex = updatedUser.coins.findIndex((c) => c.coinName === coinName);
    if (updatedUser.coins[coinIndex].amount <= 0.01) {
      // 해당 코인을 배열에서 제거합니다.
      update = {
        $pull: {
          coins: { coinName: coinName },
        },
      };
      options = { new: true }; // 이번에는 arrayFilters 옵션이 필요하지 않습니다.
      updatedUser = await userlist.findOneAndUpdate(filter, update, options);
    }

    console.log(updatedUser);
  } catch (error) {
    console.error("Error updating coin amount:", error);
  }
}

function getCoinAmount(data, coinName) {
  for (var i = 0; i < data.coins.length; i++) {
    if (data.coins[i].coinName === coinName) {
      return data.coins[i].amount;
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인매도")
    .setDescription("코인을 판매합니다.")
    .addStringOption((option) =>
      option
        .setName("매도종목")
        .setDescription(
          "판매할 코인의 이름을 입력하세요. '/코인조회' 명령어를 통해 보유한 코인을 확인하실 수 있습니다."
        )
    )
    .addStringOption((option) => option.setName("매도수량").setDescription("코인 매도 수량")),
  async execute(interaction) {
    const sellItem = interaction.options.getString("매도종목");
    const itemCount = interaction.options.getString("매도수량");
    const englishCoinName = convertKoreanToEnglish(sellItem);
    const userCoinData = await userRegistration.findOne({
      name: interaction.user.id,
    });
    const coinFound = userCoinData.coins.find((coin) => coin.coinName === englishCoinName);
    const coinAmount = getCoinAmount(userCoinData, englishCoinName);
    const hasTwoOrMoreDecimalPlaces = checkDecimalPlaces(itemCount);

    if (!userCoinData) {
      interaction.reply(`${interaction.user}, 등록되지 않은 유저입니다.`);
    } else if (!englishCoinName || !sellItem || !itemCount) {
      interaction.reply(
        `${interaction.user}, 매도에 실패했습니다. 정확한 코인명을 입력하거나 코인종목과 매도개수를 정확히 입력하세요.`
      );
    } else if (itemCount <= 0) {
      interaction.reply(`${interaction.user}, 코인 개수는 양수만을 입력해야 합니다.`);
    } else if (!coinFound) {
      interaction.reply(`${interaction.user}, 코인을 보유하고 있지 않습니다.`);
    } else if (coinAmount.toFixed(2) < itemCount) {
      interaction.reply(`${interaction.user}, 보유한 코인의 양보다 많습니다.`);
    } else if (isNaN(Number(itemCount))) {
      interaction.reply(`${interaction.user}, 코인 개수에는 숫자만을 입력해 주세요.`);
    } else if (isNaN(Number(itemCount))) {
      interaction.reply(`${interaction.user}, 코인 개수에는 숫자만을 입력해 주세요.`);
    } else if (hasTwoOrMoreDecimalPlaces) {
      interaction.reply(`${interaction.user}, 소수점 둘째자리까지만 입력가능합니다.`);
    } else {
      const url = `https://api.upbit.com/v1/ticker?markets=KRW-${englishCoinName}`;
      request(url, { json: true }, (err, res, body) => {
        const data = body;
        const CoinPrice = data[0].trade_price;
        const a = CoinPrice * itemCount;
        updateCoinAmount(interaction.user.id, englishCoinName, itemCount, CoinPrice);
        interaction.reply(
          `${
            interaction.user
          }, ${sellItem}을 개당 ${CoinPrice}₩에 ${itemCount}개 판매하였습니다.(총 ${a.toFixed(
            2
          )}₩ 판매`
        );
      });
    }
  },
};
