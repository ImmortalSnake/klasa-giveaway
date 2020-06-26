module.exports = {
	inputFiles: ['./src'],
	mode: 'file',
	out: 'docs',
	theme: 'default',
	exclude: [
		'**/+(test|languages)/*.ts',
		'**/commands/Giveaways/*.ts'
	]
};
