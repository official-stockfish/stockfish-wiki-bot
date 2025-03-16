# stockfish-wiki-bot

Custom bot for the stockfish discord,  
made to easily link to wiki entries on discord.

# Development

```
git clone https://github.com/Disservin/stockfish-wiki-bot.git
cd stockfish-wiki-bot
git submodule update --init
npm install
```

Create a new application for discord here <https://discord.com/developers/applications>.

### Fill out the missing environment variables

```
DISCORD_TOKEN=""
CLIENT_ID=""
GUILD_ID=""
GITHUB_API_TOKEN=""
```

### DISCORD_TOKEN

Navigate to <https://discord.com/developers/applications> -> Bot -> Token.

### CLIENT_ID

Navigate to <https://discord.com/developers/applications> -> OAuth2 -> General and copy the `CLIENT_ID`.

### GUILD_ID

Enable Developer on Discord and right click on the server and copy the Server Id.

### GITHUB_API_TOKEN

Generate your token here <https://github.com/settings/tokens?type=beta>

Refresh commands run
`node deploy-commands.js`

Start bot
`node index.js`
