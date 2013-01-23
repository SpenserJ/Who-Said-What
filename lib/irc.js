var irc = require('irc')
  , fs = require('fs')
  , util = require('util');

var log = fs.openSync(__dirname + '/../logs/topiaonline.txt', 'a');

// var client = new irc.Client('irc.freenode.net', 'WhoSaidWhat', {
var client = new irc.Client('irc.quakenet.org', 'WhoSaidWhat', {
  userName: 'WhoSaidWhat',
  realName: 'MalevolentJalapeno\'s Log Bot',
  channels: ['#TopiaOnline'], 
});

function writeLog(message) {
  for (var i = 1; i < arguments.length; i++) {
    message += util.inspect(arguments[i]);
  }
  console.log(message);
  fs.writeSync(log, message + '\n');
}

/*
client.addListener('raw', function(message) {
  writeLog(message);
});
*/

client.addListener('registered', function(message) {
  writeLog('Connected to server:\n', message);
});

client.addListener('names', function(channel, nicks) {
  writeLog('Names for ' + channel + ':\n', nicks);
});

client.addListener('topic', function(channel, topic, nick, message) {
  if (typeof message.nick !== 'undefined') {
    writeLog(nick + ' changed the topic of ' + channel + ' to:\n' + topic);
  } else {
    writeLog('Topic of ' + channel + ' is:\n' + topic);
  }
});

client.addListener('join', function(channel, nick, message) {
  writeLog(nick + ' joined ' + channel);
});

client.addListener('part', function(channel, nick, reason, message) {
  writeLog(nick + ' left ' + channel +
    ((typeof reason !== 'undefined') ? ':\n' + reason : ''));
});

client.addListener('kick', function(channel, nick, by, reason, message) {
  writeLog(nick + ' was kicked from ' + channel + ' by ' + by +
    ' because:\n' + reason);
});

client.addListener('message', function(from, to, message) {
  writeLog(from + ' => ' + to + ': ' + message);
});

client.addListener('nick', function(oldnick, newnick, channels, message) {
  writeLog(oldnick + ' is now known as ' + newnick + ' in:\n', channels);
});

writeLog('Need handler for quit, kill, notice, +mode, -mode');
