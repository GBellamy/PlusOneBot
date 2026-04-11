# Discord +1 Bot

## What is it?

Discord +1 is a bot that lets you **endorse any message in one click**. Right-click a message, select **Apps → +1**, and the bot immediately reposts it in the same channel as a highlighted embed — crediting the original author and showing who endorsed it.

Use it to surface a message you agree with, found funny, or simply want others to notice.

## How it works

The bot registers a **message context menu command** (no slash commands, no reactions cluttering every message). When triggered, it reposts the target message as a green embed containing:

- The name and avatar of the person who clicked +1
- The message content (and image if any)
- A **+1 button** so others can endorse the same message in one click
- A **Jump to original** button linking directly to the source message

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Discord account with permission to add bots to a server

---

### 1. Create the Discord application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Give it a name (e.g. `PlusOne`) and confirm.
3. Go to the **Bot** tab and click **Add Bot**.
4. Copy the **Token** — you will need it later.
5. Still on the **Bot** tab, scroll down to **Privileged Gateway Intents** and enable **Message Content Intent**.
6. Go to **General Information** and copy the **Application ID** — this is your Client ID.

---

### 2. Invite the bot to your server

1. Go to **OAuth2 → URL Generator**.
2. Under **Scopes**, check: `bot` and `applications.commands`.
3. Under **Bot Permissions**, check: `Send Messages` and `Read Message History`.
4. Copy the generated URL, open it in your browser, and invite the bot to your server.

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

---

### 5. Register the context menu command

This only needs to be done **once** (or again if you rename the command):

```bash
npm run deploy
```

---

### 6. Start the bot

```bash
npm start
```

The bot is now online. Right-click any message in your server → **Apps → +1**.

---

---

## Hosting on Fly.io (free, no sleep)

Fly.io offers a permanent free tier (no credit card required for small apps) with no sleep — ideal for a Discord bot.

### Prerequisites

- [Install the Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
- A Fly.io account (`fly auth signup` or `fly auth login`)

### Deploy

```bash
# First time only — creates the app on Fly.io
fly launch --no-deploy

# Set environment variables (run once)
fly secrets set DISCORD_TOKEN=your_token_here CLIENT_ID=your_client_id_here

# Deploy
fly deploy
```

> Run `npm run deploy` locally **before** deploying to register the context menu command on Discord. This only needs to be done once.

To redeploy after a code change: `fly deploy`.  
To check logs: `fly logs`.

---

## Project structure

```
discord-plusone/
├── index.js              # Bot logic
├── deploy-commands.js    # Registers the context menu command
├── Dockerfile            # Container image for Fly.io
├── fly.toml              # Fly.io deployment config
├── .env.example          # Environment variable template
├── package.json
└── README.md
```
