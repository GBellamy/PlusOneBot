require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

function buildEmbed(originalMessage, interaction) {
  const name = interaction.member?.displayName ?? interaction.user.username;
  const avatar = interaction.user.displayAvatarURL();

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setAuthor({ name, iconURL: avatar })
    .setDescription(originalMessage.content || "*[no text]*");
  // .setTimestamp(originalMessage.createdAt)
  // .setFooter({ text: "Original message" });

  const image = [...originalMessage.attachments.values()].find((a) =>
    a.contentType?.startsWith("image/"),
  );
  if (image) embed.setImage(image.url);

  return embed;
}

function buildRow(channelId, messageId, messageUrl) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`plusone:${channelId}:${messageId}`)
      .setLabel("+1")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setLabel("Jump to original")
      .setStyle(ButtonStyle.Link)
      .setURL(messageUrl),
  );
}

client.on("interactionCreate", async (interaction) => {
  // Context menu command
  if (
    interaction.isMessageContextMenuCommand() &&
    interaction.commandName === "+1"
  ) {
    const message = interaction.targetMessage;

    const hasContent =
      message.content ||
      message.embeds.length > 0 ||
      message.attachments.size > 0;
    if (!hasContent) {
      await interaction.reply({
        content: "This message has no content to relay.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [buildEmbed(message, interaction)],
      components: [buildRow(message.channelId, message.id, message.url)],
    });
    return;
  }

  // Button click
  if (interaction.isButton() && interaction.customId.startsWith("plusone:")) {
    const [, channelId, messageId] = interaction.customId.split(":");

    let originalMessage;
    try {
      const channel = await client.channels.fetch(channelId);
      originalMessage = await channel.messages.fetch(messageId);
    } catch {
      await interaction.reply({
        content: "Could not find the original message.",
        ephemeral: true,
      });
      return;
    }

    const hasContent =
      originalMessage.content ||
      originalMessage.embeds.length > 0 ||
      originalMessage.attachments.size > 0;
    if (!hasContent) {
      await interaction.reply({
        content: "This message has no content to relay.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [buildEmbed(originalMessage, interaction)],
      components: [buildRow(channelId, messageId, originalMessage.url)],
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
