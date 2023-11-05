const userRegistration = require("../models/key.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("서버정보")
    .setDescription("서버정보 확인")
    .addStringOption((option) => option.setName("이름").setDescription("응애").setRequired(true)),
  async execute(interaction) {
    const nameset = interaction.options.getString("이름");
    const data = await userRegistration.findOne({
      Guild: interaction.guild.id,
    });

    if (!data) {
      const applyname = await userRegistration.create({
        Guild: interaction.guild.id,
        name: nameset,
      });
      interaction.reply(`${nameset}님! 등록되셨습니다!`);
    } else {
      interaction.reply("이미 등록되어 있습니다.");
    }
  },
};
