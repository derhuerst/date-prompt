var moment =   require('moment');
var bluebird = require('bluebird');
var esc =      require('ansi-escapes');
var lPad =     require('left-pad');
var chalk =    require('chalk');





var digits = [
	{unit: 'day',    method: 'day',    length: 2, format: 'ddd', offset: 1},
	{unit: 'day',    method: 'date',   length: 2, format: 'DD'},
	{unit: 'month',  method: 'month',  length: 2, format: 'MMM', offset: 1},
	{unit: 'year',   method: 'year',   length: 4, format: 'YYYY'},
	{unit: 'hour',   method: 'hour',   length: 2, format: 'HH', separator: ':'},
	{unit: 'minute', method: 'minute', length: 2, format: 'mm', separator: ''}
];





var DatePrompt = {



	question: null,
	moment:   null,   // moment.js object
	value:    null,   // promise

	cursor:   null,   // current index for `digits`

	stdin:    null,   // stdin
	stdout:   null,   // stdout

	// _resolve, _reject

	cache:    null,   // typed be used
	pressed:     null,   // when a number key was pressed the last time



	init: function (question, options) {
		options = options || {};
		if ('string' !== typeof question)
			throw new Error('`question` must be a string.');

		this.question = question;
		this.moment = options.value ? moment(options.value) : moment();
		var self = this;
		this.value = new Promise(function (_resolve, _reject) {
			self.resolve = _resolve;
			self.reject =  _reject;
		});

		if (0 < options.cursor <= (digits.length - 1))
			this.cursor = parseInt(options.cursor);
		else this.cursor = 0;

		this.stdin = options.stdin || process.stdin;
		this.stdin.setRawMode(true);
		this.stdin.resume();

		this.onKey = DatePrompt.onKey.bind(this);
		this.stdin.on('data', this.onKey);

		this.stdout = options.stdout || process.stdout;
		this.stdout.write(esc.cursorHide);

		this.cache = '';
		this.pressed = Date.now();

		this.render();
		return this;
	},



	reset: function () {
		this.moment = moment();
		this.render();
	},

	abort: function () {
		this.reject();
		this.stdin.removeListener('data', this.onKey);
		this.stdin.setRawMode(false);
		this.stdin.pause();
		this.stdout.write(esc.eraseLine + '\r' + esc.cursorShow);
	},

	submit: function () {
		this.resolve(this.moment);

		this.stdin.removeListener('data', this.onKey);
		this.stdin.setRawMode(false);
		this.stdin.pause();

		this.render(true);
		this.stdout.write('\r\n' + esc.cursorShow);
	},



	onKey: function (key) {
		key = key.toString('utf8');

		if(/\x1b\[+[A-Z]/.test(key)) {
			key = key.charAt(key.length - 1);
			if (key === 'A')	return this.up();
			if (key === 'B')	return this.down();
			if (key === 'C')	return this.right();
			if (key === 'D')	return this.left();
			if (key === 'F')	return this.first();
			if (key === 'H')	return this.pressed();
		}

		var code = key.charCodeAt(0);
		// see https://en.wikipedia.org/wiki/GNU_Readline#Keyboard_shortcuts
		if (code === 1)			return this.first(); // ctrl + A
		if (code === 3)			return this.abort(); // ctrl + C
		if (code === 4)			return process.exit(); // ctrl + D
		if (code === 5)			return this.last(); // ctrl + E
		if (code === 7)			return this.reset(); // ctrl + G
		if (code === 9)			return this.right(); // ctrl + I / tab
		if (code === 10)		return this.submit(); // ctrl + J
		if (code === 13)		return this.submit(); // return
		if (code === 27)		return this.abort(); // escape
		if (code === 8747)		return this.left(); // alt + B
		if (code === 402)		return this.right(); // alt + F

		if (/[0-9]/.test(key))	return this.onNumber(parseInt(key)); // number key
	},



	onNumber: function (n) {
		var now = Date.now();
		if ((now - this.pressed) > 1000) this.cache = '' + n; // 1s elapsed
		else {
			this.cache += n;
			if (this.cache.length >= digits[this.cursor].length) { // got all digits
				var v = this.cache - (digits[this.cursor].offset || 0);
				this.moment[digits[this.cursor].method](v);
				this.cache = '';
				if (this.cursor < digits.length - 1) this.cursor++;
			}
		}
		this.pressed = now;
		this.render();
	},



	// arrow key handling

	first: function () {
		if (this.cursor !== 0) this.cache = '';
		this.cursor = 0;
		this.render();
	},
	last: function () {
		if (this.cursor !== digits.length - 1) this.cache = '';
		this.cursor = digits.length - 1;
		this.render();
	},

	left: function () {
		if (this.cursor > 0) {
			this.cursor--;
			this.cache = '';
		} else this.stdout.write(esc.beep);
		this.render();
	},
	right: function () {
		if (this.cursor < digits.length - 1) {
			this.cursor++;
			this.cache = '';
		} else this.stdout.write(esc.beep);
		this.render();
	},

	up: function () {
		this.moment.add(1, digits[this.cursor].unit);
		this.cache = '';
		this.render();
	},
	down: function () {
		this.moment.subtract(1, digits[this.cursor].unit);
		this.cache = '';
		this.render();
	},



	render: function (formatted) {
		var o = this.stdout;

		o.write(esc.eraseLine + '\r' + chalk.green(formatted ? '✔' : '?') + ' ');
		o.write(chalk.bold(this.question) + ' ');

		var i, digit;
		for (i = 0; i < digits.length; i++) {
			digit = digits[i];

			if (!formatted && i === this.cursor)
				o.write(chalk.cyan.underline(this.moment.format(digit.format)));
			else o.write(this.moment.format(digit.format));

			o.write(('string' === typeof digit.separator) ? digit.separator : ' ');
		}
	}



};



var create = module.exports = function (question, options) {
	var prompt = Object.create(DatePrompt);
	prompt.init(question, options);
	return prompt.value;
};
create.DatePrompt = DatePrompt;
