/**
 * AMQP 1.0 receiver (JMS filter)
 * @author piero@tilab
 * @version 0.0.4
 */
var container = require('rhea');
var filters = require('rhea').filter;
var amqp_types = require('rhea').types;
/* var dateFormat = require('dateformat');
var tsFormat = function() { return dateFormat(Date.now(), "dd/mm/yyyy HH:MM:ss.l\t");  }
 */
const logger = require('./logger.js').logger;

logger.info("ciao")
/* 
var args = require('./options.js').options({
	'client': { default: 'my-receiver-jms-js', describe: 'name of identifier for client container'},
    's': { alias: 'selector', default: "nat='it' AND prod='a22' AND geo LIKE 'u0j2%'", describe: "the selector string to use ('' or null for none)"},
    'm': { alias: 'messages', default: 10, describe: 'number of messages to expect'},
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
        console.log(tsFormat()+received+"-received: ", context.message);
        if (++received === expected) {
            context.receiver.detach();
            context.connection.close();
        }
    }
});

var connection = container.connect(opts).on('connection_open', function () {
	console.log(tsFormat()+'connection_open: '+opts.host+":"+opts.port);
}).on('connection_close', function () {
	console.log(tsFormat()+'connection_close');
}).on('connection_error', function (e) {
	console.log(tsFormat()+'connection_error',e.error.message, e.error.condition);
}).on('error', function (e) {
	console.log(tsFormat()+'error',e.error.message, e.error.condition);
});

if (args.flag=='rabbit') {
	args.node = "/exchange/"+args.node;
}

if (args.selector.toLowerCase()=="null" || args.selector=="''") {
	var f1 = null;
} else {
	f1 = filters.selector(args.selector);
}
if (args.flag=='verbose') console.log(tsFormat()+"filter: ", f1);

connection.open_receiver({
	name: 'my-jms-sub',
	source: {
		address: args.node,
		filter: f1
	}
})
.on('receiver_open', function() {
	console.log(tsFormat()+'receiver_open, filter: '+args.selector, ", address: "+args.node);
});
 */