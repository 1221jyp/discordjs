const userRegistration = require("../models/key.js");
const { SlashCommandBuilder } = require("discord.js");

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
    ),
  async execute(interaction) {
    const data = await userRegistration.findOne({
      name: interaction.user.id,
    });
    if (!data) {
      interaction.reply(`등록되지 않은 유저입니다.`);
    } else {
      interaction.reply(`${interaction.user}님, 정상적으로 처리되었습니다.`);
    }
  },
};
