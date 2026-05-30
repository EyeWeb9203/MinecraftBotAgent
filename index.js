const Bots = require("./bot.js")
const config = require("./config.json")


//Bot and Server information 
const owner = "EyeWeb9203"
const username = "spidy1"
// const host = "localhost"
// const port = 50000
const host = `${config.minecraft.host}`
const port = config.minecraft.port
const version = `${config.minecraft.version}`
const gamemode = `${config.minecraft.gamemode}`

newBot = new Bots(username, host, port, version, gamemode, owner);
// newBot2 = new Bots("aiBot", host, port,version, gamemode)