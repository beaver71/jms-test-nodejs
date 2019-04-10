/**
 * AMQP 1.0 sender (topic)
 * @author piero@tilab
 * @version 0.0.1
 */
var args = require('./options.js').options({
	'client': { default: 'my-sender-jmstopic-js', describe: 'name of identifier for client container'},
    'n': { alias: 'node', default: 'croads', describe: 'name of node (e.g. queue or topic) to which messages are sent'},
    'h': { alias: 'host', default: 'localhost', describe: 'dns or ip name of server where you want to connect'},
    'p': { alias: 'port', default: 5675, describe: 'port to connect to'},
	'f': { alias: 'flag', default: '', describe: 'flags (e.g. verbose)'}
}).usage('Usage: $0 [options] <messages>').help('help').argv;	// --help

var opts = {
	port: args.port,
	host: args.host,
	container_id: args.client,
	username: 'test',
	password: 'test',
};
if (args.flag=='noauth') {
	delete opts.username;
	delete opts.password;
}

var connection = require('rhea').connect(opts).on('connection_open', function () {
	console.log('connection_open: '+opts.host+":"+opts.port);
}).on('connection_close', function () {
	console.log('connection_close');
}).on('connection_error', function (e) {
	console.log('connection_error',e.error.message);
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
for (var i = 0; i < messages.length; i++) {
	var m = messages[i];
	var props = Object.assign({}, m.application_properties);	// clone props
	if (props.geo) {
		var chars = props.geo.split("");							// split into single chars
		props.geo = chars.splice(0, 4).join("");					// remove first 4 chars and joins
		if (chars.length>0) props.geo += "." + chars.join(".");		// join remaining items
	}
	var topic = Object.values(props).join(".");
	var sender_topic = connection.open_sender({
		target: {
			address: args.node+"/"+topic
		}
	});
	sendMessage(i, sender_topic, topic, m, function(){
		if (i>messages.length) {
/* 			setTimeout(function() {
				connection.close();
			}, 2000); */
		}
	});
}

function sendMessage(i, sender_topic, topic, m, cb) {
	sender_topic.topic = topic;
	sender_topic.on('sendable', function(context) {
		console.log(i+'-sent: app_properties=\x1b[32m%s\x1b[0m', JSON.stringify(m.application_properties));
		console.log('      body=\x1b[32m%s\x1b[0m - topic=\x1b[33m%s\x1b[0m', m.body, context.sender.topic);
		context.sender.send(m);
		/* context.sender.close(); */
		cb();
	})
	.on('accepted', function(context) {
		console.log('accepted: ');
	})
	.on('rejected', function(context) {
		console.log('rejected: ');
	})
	.on('sender_open', function(context) {
		console.log('sender_open, address: '+context.sender.topic);
	});
}

