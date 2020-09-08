const {createCommand} = require('../util');
const {createResumeMessage} = require('../../message_creator');

module.exports = createCommand(
    'resume',
    'resume song',
    (client, guild, args) =>
    {
        console.log('resuming');
        const serverInfo = client.voiceConnections.get(guild.id);
        if (serverInfo.dispatcher === undefined)
        {
            console.log('no dispatcher on this server');
            return;
        }
        serverInfo.textChannel.send(createResumeMessage(serverInfo.currentSong.title, serverInfo.currentSong.url));
        if (serverInfo.dispatcher.paused) serverInfo.dispatcher.resume();
    });