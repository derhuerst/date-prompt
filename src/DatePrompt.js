var moment =		require('moment');
var bluebird =		require('bluebird');
var escapes =		require('ansi-escapes');
var lPad =			require('left-pad');
var chalk =			require('chalk');





module.exports = {



	_m:			null,
	_i:			null,
	_o:			null,

	_c:			null,

	_d:			null,
	date:		null,

	_k:			null,



	init: function (question, options) {
		var self = this;
		options = options || {};

		if (!question || 'string' != typeof question)
			throw new Error('`question` must be a string.');

		this._q = question;
		this._m = options.date ? moment(options.date) : moment();
		this._i = options.stdin || process.stdin;
		this._o = options.stdout || process.stdout;

		this._c = 0;

		// let `DatePrompt` directly inherit from bluebird
		this._d = bluebird.defer();
		this.date = this._d.promise;

		var _k = function (key) {
			key = key.toString('utf8');

			if(/\x1b\[+[A-Z]/.test(key)) {
				key = key.charAt(key.length - 1);
				if		(key === 'A')	return self.up();
				else if	(key === 'B')	return self.down();
				else if	(key === 'C')	return self.right();
				else if	(key === 'D')	return self.left();
				else if	(key === 'F')	return self._c = 2;
				else if	(key === 'H')	return self._c = 0;
			}

			else if	(key === '\u0003')	return self.abort();   // ctrl + C
			else if	(key === '\x1b')	return self.abort();   // escape
			else if	(key === '\r')		return self.submit();   // carriage return
			else if	(key === '\n')		return self.submit();   // newline
			else if	(key === '\t')		return self.right();   // tab

			else if	(/[0-9]/.test(key))	return self.number(parseInt(key));   // number key
			else if (key.length > 1) {
				for (var i = 0; i < key.length; i++) _k(key[i]);
				return;
			}
		};
		this._k = _k;

		this._i.on('data', _k);
		this._i.setRawMode(true);
		this._i.resume();
		this._o.write(escapes.cursorHide);

		this.clear();
		this.render();

		return this;
	},



	abort: function () {
		this._d.reject();

		this._i.removeListener('data', this._k);
		this._i.setRawMode(false);
		this._i.pause();
		this._o.write(escapes.cursorShow);

		this.clear();
		this._o.write('\n');
	},

	submit: function () {
		this._d.resolve(this._m);

		this._i.removeListener('data', this._k);
		this._i.setRawMode(false);
		this._i.pause();
		this._o.write(escapes.cursorShow);

		this.clear();
		this.render(true);
		this._o.write('\n');
	},



	// number key handling

	number: function (n) {
		// todo
	},



	// arrow key handling

	first: function () {
		this._c = 0;
		this.clear();
		this.render();
	},
	right: function () {
		this._c = 2;
		this.clear();
		this.render();
	},

	left: function () {
		if (this._c > 0) this._c--;
		else this._o.write(escapes.beep);
		this.clear();
		this.render();
	},
	right: function () {
		if (this._c < 2) this._c++;
		else this._o.write(escapes.beep);
		this.clear();
		this.render();
	},

	up: function () {
		if (this._c === 0) this._m.add(1, 'day');
		else if (this._c === 1) this._m.add(1, 'month');
		else this._m.add(1, 'year');
		this.clear();
		this.render();
	},
	down: function () {
		if (this._c === 0) this._m.subtract(1, 'day');
		else if (this._c === 1) this._m.subtract(1, 'month');
		else this._m.subtract(1, 'year');
		this.clear();
		this.render();
	},



	// rendering

	clear: function () {
		this._o.write(escapes.eraseLine + '\r');
	},

	render: function (formatted) {
		if (formatted) {
		this._o.write([
			chalk.green('✔'),
			chalk.bold(this._q),
			chalk.cyan(this._m.format('dd DD MMM YYYY'))
		].join(' '));
			return;
		}
		this._o.write([
			chalk.green('?'),
			chalk.bold(this._q),
			this._m.format('dd')
		].join(' '));
		var digits = [];
		digits.push(lPad(this._m.format('D'), 2, ' '));
		digits.push(this._m.format('MMM'));
		digits.push(this._m.format('YYYY'));
		digits[this._c] = chalk.underline.yellow(digits[this._c]);
		this._o.write(' ' + digits.join(' '));
	},



};
