const { SlashCommandBuilder } = require("discord.js");
const dotenv = require("dotenv");
const request = require("request");
const urlencode = require("urlencode");
dotenv.config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("레벨")
    .setDescription("당신의 롤 레벨을 알려줍니다!")
    .addStringOption((option) =>
      option.setName("id").setDescription("your lol id here!").setRequired(true)
    ),
  async execute(interaction) {
    const username = interaction.options.getString("id");
    const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(
      username
    )}?api_key=${process.env.riottoken}`;
    request(url, { json: true }, (err, res, body) => {
      const userlevel = body.summonerLevel;
      console.log(userlevel);
      interaction.reply(`${username}의 레벨은'${userlevel}'입니다. `);
    });
  },
};
