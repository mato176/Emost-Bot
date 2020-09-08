const {createCommand} = require('../util');
const {createPauseMessage} = require("../../message_creator")

module.exports = createCommand(
    'pause',
    'pause the audio playing',
    async (client, guild, args) =>
    {
        const serverInfo = client.voiceConnections.get(guild.id);
        serverInfo.textChannel.send(createPauseMessage(serverInfo.currentSong.title, serverInfo.currentSong.url));
        console.log(`Guild ${guild.id}: Pausing ${serverInfo.currentSong.url}`);
        if (serverInfo.dispatcher === undefined)
        {
            console.log('no dispatcher on this server');
            return;
        }
        serverInfo.dispatcher.pause();
    });