var DatePrompt =	require('./DatePrompt');





var factory = module.exports = function (options) {
	var instance = Object.create(DatePrompt);
	instance.init(options);
	return instance;
};

factory.DatePrompt = DatePrompt;
