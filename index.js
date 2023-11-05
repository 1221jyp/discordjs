const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const { connect } = require("mongoose");
const mongoose = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("connected"));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

const token = process.env.token;
client.login(token);

client.on("ready", () => {
  // ready 이벤트시 실행할 함수
  console.log(`Logged in as ${client.user.tag}!`); // client.user 는 자신의 유저 객체이고 tag 는 유저 객체의 프로퍼티 입니다.
});

(async () => {
  await connect(process.env.mongodb, { keepAlive: true }).catch(console.error);

  if (mongoose.connect) {
    console.log("connected");
  }
})();

client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.content === "ping") {
    // Discord.Message 객체의 content 프로퍼티가 'ping' 일 때
    message.reply(`you said ${message.content}!`); // reply 는 멘션 + , msg 로 출력됩니다.
  }
});
