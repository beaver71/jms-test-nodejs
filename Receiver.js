/**
 * AMQP 1.0 receiver (JMS filter)
 * @author piero@tilab
 * @version 0.0.4
 */
var container = require('rhea');
var filters = require('rhea').filter;
var amqp_types = require('rhea').types;
const logger = require('./logger.js').logger;

var args = require('./options.js').options({
	'client': { default: 'my-receiver-jms-js', describe: 'name of identifier for client container'},
    's': { alias: 'selector', default: "nat='it' AND prod='a22' AND geo LIKE 'u0j2%'", describe: "the selector string to use ('' or null for none)"},
    'm': { alias: 'messages', default: 1000, describe: 'number of messages to expect'},
    'n': { alias: 'node', default: 'croads', describe: 'name of node (e.g. queue or topic) from which messages are received'},
    'h': { alias: 'host', default: 'localhost', describe: 'dns or ip name of server where you want to connect'},
    'p': { alias: 'port', default: 5673, describe: 'port to connect to'},
	'u': { alias: 'user', default: 'test', describe: 'username'},
	'w': { alias: 'pwd', default: 'test', describe: 'password'},
	'f': { alias: 'flag', default: '', describe: 'flags (e.g. verbose)'}
}).help('help').argv;

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

var received = 0;
var expected = args.messages;

container.on('message', function (context) {
    if (context.message.properties && context.message.properties.id && context.message.properties.id < received) {
        // ignore duplicate message
        return;
    }
    if (expected === 0 || received < expected) {
        logger.info(received+"-received: ", context.message);
        if (++received === expected) {
            context.receiver.detach();
            context.connection.close();
        }
    }
});

var connection = container.connect(opts).on('connection_open', function () {
	logger.info('connection_open: '+opts.host+":"+opts.port);
}).on('connection_close', function () {
	logger.info('connection_close');
}).on('connection_error', function (e) {
	logger.error('connection_error',e.message, e.condition);
}).on('error', function (e) {
	logger.error('error',e.message, e.condition);
});

if (args.flag=='rabbit') {
	args.node = "/exchange/"+args.node;
}

if (args.selector.toLowerCase()=="null" || args.selector=="''") {
	var f1 = null;
} else {
	f1 = filters.selector(args.selector);
}
if (args.flag=='verbose') logger.info(" >filter: ", f1);

connection.open_receiver({
	name: 'my-jms-sub',
	source: {
		address: args.node,
		filter: f1
	}
})
.on('receiver_open', function() {
	logger.info('receiver_open, filter: '+args.selector, ", address: "+args.node);
    logger.info('   >waiting for max '+expected+" messages...");
});
