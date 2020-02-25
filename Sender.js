/**
 * AMQP 1.0 sender (app properties)
 * @author piero@tilab
 * @version 0.0.4
 */
var dateFormat = require("dateformat");
const logger = require('./logger.js').logger;

var args = require('./options.js').options({
	'client': { default: 'my-sender-js', describe: 'name of identifier for client container'},
    'n': { alias: 'node', default: 'croads', describe: 'name of node (e.g. queue or topic) to which messages are sent'},
    'h': { alias: 'host', default: 'localhost', describe: 'dns or ip name of server where you want to connect'},
    'p': { alias: 'port', default: 5673, describe: 'port to connect to'},
	'u': { alias: 'user', default: 'test', describe: 'username'},
	'w': { alias: 'pwd', default: 'test', describe: 'password'},
	'f': { alias: 'flag', default: '', describe: 'flags (e.g. verbose)'}
}).usage('Usage: $0 [options] <messages>').help('help').argv;	// --help

var opts = {
	port: args.port,
	host: args.host,
	container_id: args.client,
	username: args.user,
	password: args.pwd,
};
if (args.flag=='noauth') {
	delete opts.username;
	delete opts.password;
}

var connection = require('rhea').connect(opts).on('connection_open', function () {
	logger.info('connection_open: '+opts.host+":"+opts.port);
}).on('connection_close', function () {
	logger.info('connection_close');
}).on('connection_error', function (e) {
	logger.error('connection_error',e.error.message);
});

if (args.flag=='rabbit') {
	args.node = "/exchange/"+args.node;
}

var messages = [
	{application_properties:{nat:'it',prod:'a22',type:'asn1',det:'denm',geo:'u0j2ws2'},body:'test1'},
    {application_properties:{nat:'at',prod:'xyz',type:'datex',det:'ivim'},body:'test2'},
    {application_properties:{nat:'at',prod:'xyz',type:'asn1',det:'denm'},body:'test3'},
    {application_properties:{nat:'it',prod:'a22',type:'asn1',det:'ivim',geo:'u0j2x5z'},body:'test4'},
    {application_properties:{nat:'it',prod:'a22',type:'asn1',det:'denm',geo:'u0j8rkm'},body:'test5'}
];
var sender_head = connection.open_sender(args.node);
sender_head.on('sendable', function(context) {
    for (var i = 0; i < messages.length; i++) {
        var m = messages[i];
        logger.info(i+'-sent: app_properties=\x1b[32m%s\x1b[0m', JSON.stringify(m.application_properties));
		logger.info('      body=\x1b[32m%s\x1b[0m', m.body);
        sender_head.send(m);
    }
    connection.close();
})
.on('sender_open', function() {
	logger.info('sender_open, address: '+args.node);
});
