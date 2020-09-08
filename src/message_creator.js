const {MessageEmbed} = require('discord.js');
const {warning_message, commands_message, github} = require("../config/config.json")
function createPlayMessage({title, url, transcribed})
{
    return new MessageEmbed()
        .setTitle('Playing')
        .addField("Song Information", `[${title}](${url})`)
        .addField("Transcribed Command", "Play " + transcribed);
}

function createConnectSuccessMessage({voiceChannel})
{
    return new MessageEmbed()
        .setTitle(`Connected to ${voiceChannel}`)
        .addField("User Warning", warning_message)
        .addField("Command Information", commands_message)
        .addField("More Information", `[GitHub Repository](${github})`);
}

function createConnectFailMessage({voiceChannel, reason})
{
    return new MessageEmbed()
        .setTitle(`Failed to connect to ${voiceChannel}`)
        .addField("Reason", reason)
        .addField("More Information", `[GitHub Repository](${github})`);
}

function createPauseMessage(title, url)
{
    return new MessageEmbed()
        .setTitle('Pausing')
        .addField("Song Information", `[${title}](${url})`);
}

function createDisconnectMessage()
{
    return new MessageEmbed()
        .setTitle('Disconnecting')
        .addField("Reason", "NOT YET IMPLEMENTED");
}

function createQueueMessage(currentTitle, currentUrl, queuedTitle, queuedUrl, position)
{
    return new MessageEmbed()
        .setTitle('Queueing')
        .addField("Current Song Playing", `[${currentTitle}](${currentUrl})`)
        .addField("Queued Song", `[${queuedTitle}](${queuedUrl})\nPosition #${position}`);
}

function createResumeMessage(title, url)
{
    return new MessageEmbed()
        .setTitle('Resuming')
        .addField("Song Information", `[${title}](${url})`);
}

// TODO aware of repetition and just create a more general function for the following three: play, pause, skip, and resume but leaving it like this in case I want to change anything in future

module.exports = {createPlayMessage, createConnectSuccessMessage, createQueueMessage, createPauseMessage, createResumeMessage, createDisconnectMessage};