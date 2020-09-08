const {createCommand} = require('../util');
const ytdl = require('ytdl-core-discord');
const get_yt_url = require('yt-search');
const {createPlayMessage, createQueueMessage} = require('../../message_creator.js');

module.exports = createCommand(
    'play',
    'play a song',
    play);

async function play(client, guild, args)
{
    const serverInfo = client.voiceConnections.get(guild.id);
    if (args.length === 0) return serverInfo.textChannel.send("Did not receive any song argument when attempting 'play'");
    const song = args.join(" ");

    const videos = await get_yt_url(song);
    let songStream;
    try
    {
        songStream = await ytdl(videos.videos[0].url, {highWaterMark: 1 << 25});
    }
    catch(error)
    {
        console.log("MUSIC ERROR");
        console.error(error);
        return serverInfo.textChannel.send("An error has occurred when attempting to get the song, please try again.");
    }
    const songInfo = {
        title: videos.videos[0].title,
        url: videos.videos[0].url,
        transcribed: song,
        stream: songStream};
    if (!serverInfo.dispatcher) realPlay(serverInfo, guild, songInfo);
    else
    {
        serverInfo.queue.push(songInfo);
        const currentSong = serverInfo.currentSong;
        serverInfo.textChannel.send(createQueueMessage(currentSong.title, currentSong.url, songInfo.title, songInfo.url, serverInfo.queue.length));
        console.log(`Guild ${guild.id}: Adding ${songInfo.url} to queue`);
    }
}

function realPlay(serverInfo, guild, songInfo)
{
    serverInfo.currentSong = songInfo;

    serverInfo.textChannel.send(createPlayMessage(songInfo));
    console.log(`Guild ${guild.id}: Playing ${serverInfo.currentSong.url}`);

    serverInfo.dispatcher = serverInfo.connection.play(serverInfo.currentSong.stream,{type: 'opus'});
    serverInfo.dispatcher.on("start", () => console.log(`Guild ${guild.id}: ${serverInfo.currentSong.url} started playing`));
    serverInfo.dispatcher.on("finish", () =>
    {
        console.log(`Guild ${guild.id}: ${serverInfo.currentSong.url} finished playing`);
        if (serverInfo.queue.length === 0)
        {
            serverInfo.currentSong.stream.destroy();
            serverInfo.currentSong = undefined;
            serverInfo.dispatcher.destroy();
            serverInfo.dispatcher = undefined;
            return;
        }
        realPlay(serverInfo, guild, serverInfo.queue.shift());
    });
    serverInfo.dispatcher.on("end", () => console.log(`Guild ${guild.id}: Song dispatcher ended`));
}