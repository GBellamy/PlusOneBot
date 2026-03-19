require('dotenv').config();
const { REST, Routes, ApplicationCommandType } = require('discord.js');

const commands = [
  {
    name: '+1',
    type: ApplicationCommandType.Message,
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering context menu command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Command "+1" successfully registered.');
  } catch (error) {
    console.error(error);
  }
})();
