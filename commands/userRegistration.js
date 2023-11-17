const userRegistration = require("../models/key.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("유저등록")
    .setDescription("모의투자에 참여하기 위해 유저를 등록합니다."),
  async execute(interaction) {
    const data = await userRegistration.findOne({
      name: interaction.user.id,
    });
    if (!data) {
      const applyname = await userRegistration.create({
        Guild: interaction.guild.id,
        name: interaction.user.id,
        Money: 100000000,
        coins: [
          { coinName: "BTC", amount: 5 },
          { coinName: "ETH", amount: 10 },
        ],
      });
      interaction.reply(`${interaction.user}님! 등록되셨습니다!`);
    } else {
      interaction.reply("이미 등록되어 있습니다.");
    }
  },
};
