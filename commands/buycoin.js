const userRegistration = require("../models/key.js");
const { SlashCommandBuilder } = require("discord.js");
const coinNameList = require("../models/coinnames.js");
const userlist = require("../models/key.js");
const request = require("request");
const coinprice = require("./coinprice.js");

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

async function updateCoinAmount(userId, coinName, newAmount, CoinPrice) {
  try {
    const filter = { name: userId }; // 사용자를 식별하는 필터
    const update = {
      $inc: {
        "coins.$[elem].amount": newAmount,
        Money: -CoinPrice * newAmount, // coins 배열의 특정 요소의 amount를 증가
      },
    };
    const options = {
      arrayFilters: [{ "elem.coinName": coinName }], // 업데이트할 배열 요소를 지정
      new: true, // 업데이트된 문서를 반환
    };

    const updatedUser = await userlist.findOneAndUpdate(filter, update, options);
    console.log(updatedUser);
  } catch (error) {
    console.error("Error updating coin amount:", error);
  }
}

async function AddCoinAmount(userId, coinName, newAmount, CoinPrice) {
  console.log(111);
  try {
    const filter = { name: userId }; // 사용자를 식별하는 필터
    const update = {
      $push: {
        coins: {
          // 'coins' 필드에 새 객체를 추가합니다.
          coinName: coinName,
          amount: newAmount,
        },
      },
      $inc: {
        Money: -CoinPrice * newAmount, // 'Money' 필드 값을 감소시킵니다.
      },
    };
    const options = {
      new: true, // 업데이트된 문서를 반환
    };

    const addedUser = await userlist.findOneAndUpdate(filter, update, options);
    console.log(addedUser);
  } catch (error) {
    console.error("Error updating coin amount:", error);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인매수")
    .setDescription("코인을 구매합니다.")
    .addStringOption((option) =>
      option
        .setName("매수종목")
        .setDescription(
          "구매할 코인의 이름을 입력하세요. '/코인목록' 명령어를 통해 코인 목록을 확인하실 수 있습니다."
        )
    )
    .addStringOption((option) => option.setName("매수수량").setDescription("코인 매수 수량")),
  async execute(interaction) {
    const buyItem = interaction.options.getString("매수종목");
    const itemCount = interaction.options.getString("매수수량");
    const englishCoinName = convertKoreanToEnglish(buyItem);
    const userCoinData = await userRegistration.findOne({
      name: interaction.user.id,
    });
    const hasTwoOrMoreDecimalPlaces = checkDecimalPlaces(itemCount);
    // 'BTC'
    function checkForCoin(coinsArray, coinToCheck) {
      // some() 메서드는 배열의 어느 하나의 요소라도 주어진 함수를 통과하는지 테스트합니다.
      return coinsArray.some((coin) => coin.coinName === coinToCheck);
    }
    if (!userCoinData) {
      interaction.reply(`${interaction.user}등록되지 않은 유저입니다.`);
    } else if (!englishCoinName || !buyItem || !itemCount) {
      interaction.reply(
        `${interaction.user}, 매수에 실패했습니다. 정확한 코인명을 입력하거나 코인종목과 매수개수를 정확히 입력하세요.`
      );
    } else if (isNaN(Number(itemCount))) {
      interaction.reply(`${interaction.user}, 코인 개수에는 숫자만을 입력해 주세요.`);
    } else if (itemCount <= 0) {
      interaction.reply(`${interaction.user}, 코인 개수는 양수만을 입력해야 합니다.`);
    } else if (hasTwoOrMoreDecimalPlaces) {
      interaction.reply(`${interaction.user}, 소수점 둘째자리까지만 입력가능합니다.`);
    } else if (userCoinData.coins.length >= 10) {
      interaction.reply(
        `${interaction.user}, 코인 종류를 최대한도인 10개까지 보유하고 있습니다. 새로운 코인을 매수할 수 없습니다.`
      );
    } else {
      const url = `https://api.upbit.com/v1/ticker?markets=KRW-${englishCoinName}`;
      request(url, { json: true }, (err, res, body) => {
        const data = body;
        const CoinPrice = data[0].trade_price;
        const a = CoinPrice * itemCount;
        if (CoinPrice * itemCount > userCoinData.Money) {
          interaction.reply("돈이 부족합니다.");
        } else if (checkForCoin(userCoinData.coins, englishCoinName)) {
          updateCoinAmount(interaction.user.id, englishCoinName, itemCount, CoinPrice);
          interaction.reply(
            `${
              interaction.user
            }, ${buyItem}을 개당 ${CoinPrice}₩에 ${itemCount}개 구매하였습니다.(총 ${a.toFixed(
              2
            )}₩ 구매)`
          );
        } else {
          AddCoinAmount(interaction.user.id, englishCoinName, itemCount, CoinPrice);
          interaction.reply(
            `${
              interaction.user
            }, ${buyItem}을 개당 ${CoinPrice}₩에 ${itemCount}개 구매하였습니다. (총 ${a.toFixed(
              2
            )}₩ 구매)`
          );
        }
      });
    }
  },
};
