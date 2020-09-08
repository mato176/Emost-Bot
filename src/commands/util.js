const {initial_audio_src} = require('../../config/config.json');
const ytdl = require('ytdl-core');

function createCommand(name, description, func)
{
    return {name: name, description: description, execute: func};
}

function fixVoiceReceive(connection) {
    // Play something to send a opcode 5 payload (apparently a requirement that was not documented)
    // https://github.com/discord/discord-api-docs/issues/808
    const dispatcher = connection.play(ytdl(initial_audio_src,
        {filter: "audioonly", range: {start: 0, end: 2500}}));
    dispatcher.on("error", (err) => console.log(err));
    dispatcher.on("start", () => console.log(`Guild ${connection.channel.guild.id}: Starting initial audio for payload request`));
    dispatcher.on("finish", () => {
        console.log(`Guild ${connection.channel.guild.id}: Finished the initial audio`);
        dispatcher.destroy();
    });
    return dispatcher;
}

module.exports = {createCommand, fixVoiceReceive};