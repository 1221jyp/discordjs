const nodemon = require("nodemon");
const userRegistration = require("../models/key.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const coinNameList = require("../models/coinnames.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("코인조회")
    .setDescription("자신이 보유하고있는 코인을 확인합니다."),
  async execute(interaction) {
    const userData = await userRegistration.findOne({ name: interaction.user.id });
    const userCoinData = userData.coins;
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x79cf9f)
      .setTitle(`${interaction.user.username}님의 보유코인`)
      .setDescription("보유중인 모든 코인의 정보를 보여줍니다.")
      .setTimestamp();
    userCoinData.forEach((coin, index) => {
      const coinNameInKorean = coinNameList[coin.coinName] || coin.coinName;
      exampleEmbed.addFields({
        name:
          "```" +
          `${index + 1}.${coinNameInKorean} ` +
          "```" +
          ":" +
          "```" +
          `${coin.amount}개` +
          "```",
        value: ` `,
      });
    });

    if (!data) {
      interaction.reply(`${interaction.user}님은 등록되어있지 않습니다.`);
    } else {
      async function sendMessages() {
        await interaction.reply(`${interaction.user}님의 코인조회를 시작합니다!`);
        await interaction.editReply({ embeds: [exampleEmbed] });
      }
      sendMessages();
    }
  },
};
