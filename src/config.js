module.exports.config = {
	prefix: '..',
	commandEditing: true,
	typing: true,
	preserveSettings: false,
	noPrefixDM: true,
	disabledCorePieces: ['providers', 'commands'],
	providers: {
		default: 'mongodb'
	},
	pieceDefaults: {
		commands: {
			quotedStringSupport: true,
			runIn: ['text'],
			usageDelim: ' '
		}
	}
};

module.exports.mongoOptions = {
	uri: `mongodb+srv://ImmortalSnake:${process.env.PASS}@musiccraft-pp2oj.mongodb.net/giveaway`,
	options: {
		useNewUrlParser: true,
		reconnectInterval: 500,
		reconnectTries: Number.MAX_VALUE,
		poolSize: 5,
		connectTimeoutMS: 10000,
		autoIndex: false,
	},
};