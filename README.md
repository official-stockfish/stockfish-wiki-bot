# stockfish-wiki-bot

Custom bot for the stockfish discord,  
made to easily link to wiki entries on discord.

# Development

Create a new application for discord here <https://discord.com/developers/applications>.

## Fill out the missing environment variables

```
DISCORD_TOKEN=""
CLIENT_ID=""
GUILD_ID=""
GITHUB_API_TOKEN=""
```

## DISCORD_TOKEN

Discord Tokens can only be viewed once afterwards you have to reset it.  
Navigate to <https://discord.com/developers/applications> -> Reset Secret.

## CLIENT_ID

Navigate to <https://discord.com/developers/applications> -> OAuth2 -> General and copy the `CLIENT_ID`.

### GUILD_ID

Enable Developer on Discord and right click on the server and copy the Server Id.

### GITHUB_API_TOKEN

Generate your token here <https://github.com/settings/tokens?type=beta>

Start bot
`node index.js`

Refresh commands run
`node deploy-commands.js`

# Server Setup

The server uses pm2 to manage the bot and runs this script every 12hrs.

```
git -C ../stockfish-wiki-bot/Stockfish.wiki checkout master
git -C ../stockfish-wiki-bot/Stockfish.wiki pull
/usr/bin/node /usr/bin/pm2 restart all
```
