/**
 * AMQP 1.0 receiver (topic)
 * @author piero@tilab
 * @version 0.0.1
 */
var container = require('rhea');
var filters = require('rhea').filter;
var amqp_types = require('rhea').types;

var args = require('./options.js').options({
	'client': { default: 'my-receiver-jmstopic-js', describe: 'name of identifier for client container'},
    't': { alias: 'topic', default: "it.a22.*.*.u0j2.#", describe: 'the topic to bind to'},
    'm': { alias: 'messages', default: 10, describe: 'number of messages to expect'},
    'n': { alias: 'node', default: 'croads', describe: 'name of node (e.g. queue or exchange) from which messages are received'},
    'h': { alias: 'host', default: 'localhost', describe: 'dns or ip name of server where you want to connect'},
    'p': { alias: 'port', default: 5675, describe: 'port to connect to'},
	'f': { alias: 'flag', default: '', describe: 'flags (e.g. verbose)'}
}).help('help').argv;

var opts = {
	port: args.port,
	host: args.host,
	container_id: args.client,
	username: 'test',
	password: 'test',
};

var received = 0;
var expected = args.messages;

container.on('message', function (context) {
    if (context.message.properties && context.message.properties.id && context.message.properties.id < received) {
        // ignore duplicate message
        return;
    }
    if (expected === 0 || received < expected) {
        console.log(received+"-received: ", context.message);
        if (++received === expected) {
            context.receiver.detach();
            context.connection.close();
        }
    }
});

var connection = container.connect(opts).on('connection_open', function () {
	console.log('connection_open: '+opts.host+":"+opts.port);
}).on('connection_close', function () {
	console.log('connection_close');
}).on('connection_error', function (e) {
	console.log('connection_error',e.error.message, e.error.condition);
});

if (args.flag=='rabbit') {
	args.node = "/exchange/"+args.node;
}
connection.open_receiver({
	name: 'my-topic-sub',
	source: {
		address: args.node+"/"+args.topic
	}
})
.on('receiver_open', function() {
	console.log('receiver_open, topic: ', args.topic, ", address: "+args.node+"/"+args.topic);
})
