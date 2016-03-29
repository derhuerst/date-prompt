'use strict'

const moment =   require('moment')
const keypress = require('keypress')
const ui =       require('cli-styles')
const esc =      require('ansi-escapes')
const chalk =    require('chalk')





const digits = [
	  {unit: 'day',    method: 'day',    length: 2, format: 'ddd', offset: 1}
	, {unit: 'day',    method: 'date',   length: 2, format: 'DD'}
	, {unit: 'month',  method: 'month',  length: 2, format: 'MMM', offset: 1}
	, {unit: 'year',   method: 'year',   length: 4, format: 'YYYY'}
	, {unit: 'hour',   method: 'hour',   length: 2, format: 'HH',  separator: ':'}
	, {unit: 'minute', method: 'minute', length: 2, format: 'mm',  separator: ''}
]





const DatePrompt = {

	  question: null
	, moment:   null   // moment.js object
	, value:    null   // promise

	, cursor:   null   // current index for `digits`

	, stdin:    null   // stdin
	, stdout:   null   // stdout

	// _resolve, _reject

	, cache:    null   // typed be used
	, pressed:  null   // when a number key was pressed the last time
	, done:     false
	, aborted:  false



	, init: function (question, options) {
		options = options || {}
		if ('string' !== typeof question)
			throw new Error('`question` must be a string.')
		const self = this

		this.question = question
		this.moment = options.value ? moment(options.value) : moment()
		this.value = new Promise(function (resolve, reject) {
			self.resolve = resolve
			self.reject =  reject
		})

		if ('number' === typeof options.cursor
			&& 0 < options.cursor <= (digits.length - 1))
			this.cursor = parseInt(options.cursor)
		else this.cursor = 0

		keypress(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.resume()
		process.stdin.on('keypress', function (raw, key) {
			let type = ui.keypress(raw, key)
			if (self[type]) self[type]()
			else self.onKey(type)
		})

		process.stdout.write(esc.cursorHide)

		this.cache = ''
		this.pressed = Date.now()

		process.stdout.write('\n')
		this.render()
		return this
	}



	, reset: function () {
		this.moment = moment()
		this.aborted = this.done = false
		this.render()
	}

	, abort: function () {
		this.reject()
		process.stdin.removeListener('data', this.onKey)
		process.stdin.setRawMode(false)
		process.stdin.pause()
		this.aborted = this.done = true
		process.stdout.write(esc.cursorShow)
		this.render()
	}

	, submit: function () {
		this.resolve(this.moment)

		process.stdin.removeListener('data', this.onKey)
		process.stdin.setRawMode(false)
		process.stdin.pause()
		this.done = true
		process.stdout.write(esc.cursorShow)
		this.render()
	}



	, onKey: function (n) {
		if (!/[0-9]/.test(n)) return
		n = parseInt(n)

		let now = Date.now()
		if ((now - this.pressed) > 1000) this.cache = '' + n; // 1s elapsed
		else {
			this.cache += n
			if (this.cache.length >= digits[this.cursor].length) { // got all digits
				let v = this.cache - (digits[this.cursor].offset || 0)
				this.moment[digits[this.cursor].method](v)
				this.cache = ''
				if (this.cursor < digits.length - 1) this.cursor++
			}
		}
		this.pressed = now
		this.render()
	}



	// arrow key handling

	, first: function () {
		if (this.cursor !== 0) this.cache = ''
		this.cursor = 0
		this.render()
	}
	, last: function () {
		if (this.cursor !== digits.length - 1) this.cache = ''
		this.cursor = digits.length - 1
		this.render()
	}

	, left: function () {
		if (this.cursor > 0) {
			this.cursor--
			this.cache = ''
			this.render()
		} else process.stdout.write(esc.beep)
	}
	, right: function () {
		if (this.cursor < digits.length - 1) {
			this.cursor++
			this.cache = ''
			this.render()
		} else process.stdout.write(esc.beep)
	}

	, up: function () {
		this.moment.add(1, digits[this.cursor].unit)
		this.cache = ''
		this.render()
	}
	, down: function () {
		this.moment.subtract(1, digits[this.cursor].unit)
		this.cache = ''
		this.render()
	}



	, renderDigits: function (moment, cursor, done) {
		let str = ''
		for (let i = 0; i < digits.length; i++) {
			let digit = digits[i]
			if (!done && i === cursor)
				str += chalk.cyan.underline(moment.format(digit.format))
			else str += moment.format(digit.format)
			str += digit.separator || ' '
		}
		return str
	}

	, render: function () {
		process.stdout.write(
		  esc.eraseLines(2)
		+ [
			ui.symbol(this.done, this.aborted),
			chalk.bold(this.question),
			ui.delimiter,
			this.renderDigits(this.moment, this.cursor, this.done)
		].join(' ') + '\n')
	}

}



const create = (question, options) =>
	Object.create(DatePrompt).init(question, options).value



module.exports = Object.assign(create, {DatePrompt})
