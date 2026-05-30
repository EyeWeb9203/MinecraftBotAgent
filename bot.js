const mineflayer = require("mineflayer")
const commands = require("./commandManager.js")
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")

let botArg = {
    username: "bot",
    host: "localhost",
    port: 50000,
    version: "1.21.4",
    gamemode: "survival",
    owner: null
};


class Bot {
    constructor(username, host, port, version, gamemode, owner) {
        this.username = username || botArg['username'];
        this.host = host || botArg["host"];
        this.port = port || botArg["port"];
        this.version = version || botArg["version"];
        this.gamemode = gamemode || botArg["gamemode"];
        this.owner= owner || botArg["owner"]

        this.initBot();
    }

    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version,
            "gamemode": this.gamemode
        });

        this.initEvents();
    }

    initEvents() {
        console.log(`MainPlayer: ${this.owner}`)

        this.bot.on("login", () => {
            console.log(`bot: ${this.username} login`)
        })
        this.bot.on('spawn', () => {
            console.log(`bot: ${this.bot.username} spawned`);
        });
        this.bot.on('kicked', (reason) => {
            console.log(`bot: ${this.bot.username}; Kicked: ${reason}`);
        });
        this.bot.on('error', (err) => {
            console.log(`bot: ${this.bot.username}; Error: ${err}`);
            console.log("reconnecting in 10 seconds...")
            // this.bot = null;
            try {
                setTimeout(() => { this.reconnect() }, 10000);
            } catch (err) {
                console.log(`reconnection error: ${err}`)
            }
        });
        this.bot.on('end', () => {
            console.log(`bot: ${this.bot.username}; Disconnected`);
            console.log("reconnecting in 10 seconds...")
            // this.bot = null;
            try {
                setTimeout(() => { this.reconnect() }, 10000);
            } catch (err) {
                console.log(`reconnection error: ${err}`)
            }
        });
        this.bot.on('whisper', (username, message) => {
            console.log(`${username}: ${message}`)
            if (username === this.bot.username) return;

            this.bot.whisper(username, `Hi ${username}, I heard you!`);
        });

        this.bot.on("chat", async (username, message) => {
            console.log(`${username}: ${message}`)
            if (username === this.bot.username) return

            // allow only owner
            if (username !== this.owner) return

            if (!message.startsWith(`!bot `)) return

            this.bot.chat(`Owner command: ${message}`)

            // const response = await this.ai.ask(message)

            this.handleCommand(this.bot,username,message)

        })


    }

    reconnect() {
        if (this.reconnecting) return;

        this.reconnecting = true;

        setTimeout(() => {
            this.reconnecting = false
            this.initBot()
        }, 1000)
    }


    handleCommand(bot,username,message) {
        commands.commandExecutor(bot,username,message);
    }
}


module.exports = Bot;