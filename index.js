'use strict'

const ui =       require('cli-styles')
const esc =      require('ansi-escapes')
const chalk =    require('chalk')
const moment =   require('moment')
const wrap =     require('prompt-skeleton')



const digits = [
	  {unit: 'day',    method: 'day',    length: 2, format: 'ddd', offset: 1}
	, {unit: 'day',    method: 'date',   length: 2, format: 'DD'}
	, {unit: 'month',  method: 'month',  length: 2, format: 'MMM', offset: 1}
	, {unit: 'year',   method: 'year',   length: 4, format: 'YYYY'}
	, {unit: 'hour',   method: 'hour',   length: 2, format: 'HH',  separator: ':'}
	, {unit: 'minute', method: 'minute', length: 2, format: 'mm',  separator: ''}
]

const isNumber = /[0-9]/

const DatePrompt = {

	  reset: function () {
	  	this.typed = ''; this.lastHit = 0
		this.value = this.initialValue
		this.render()
	}

	, abort: function () {
		this.done = this.aborted = true
		this.render()
		this.out.write('\n')
		this.close()
	}

	, submit: function () {
		this.done = true
		this.aborted = false
		this.render()
		this.out.write('\n')
		this.close()
	}



	// arrow key handling

	, first: function () {
		if (this.cursor !== 0)
			{this.typed = ''; this.lastHit = 0}
		this.cursor = 0
		this.render()
	}
	, last: function () {
		if (this.cursor !== digits.length - 1)
			{this.typed = ''; this.lastHit = 0}
		this.cursor = digits.length - 1
		this.render()
	}

	, left: function () {
		if (this.cursor === 0) return this.bell()
		this.typed = ''; this.lastHit = 0
		this.cursor--
		this.render()
	}
	, right: function () {
		if (this.cursor === digits.length - 1) return this.bell()
		this.typed = ''; this.lastHit = 0
		this.cursor++
		this.render()
	}
	, next: function () {
		this.typed = ''; this.lastHit = 0
		this.cursor = (this.cursor + 1) % digits.length
		this.render()
	}

	, up: function () {
		this.typed = ''; this.lastHit = 0
		this.value.add(1, digits[this.cursor].unit)
		this.render()
	}
	, down: function () {
		this.typed = ''; this.lastHit = 0
		this.value.subtract(1, digits[this.cursor].unit)
		this.render()
	}



	, _: function (n) {
		if (!isNumber.test(n)) return this.bell()

		const now = Date.now()
		if ((now - this.lastHit) > 1000) this.typed = '' // 1s elapsed
		this.typed += n
		this.lastHit = now

		const d = digits[this.cursor]
		const v = parseInt(this.typed) - (d.offset || 0)
		const typedLength = Math.abs(parseInt(this.typed)).toString().length

		if (typedLength >= d.length) {
			this.typed = ''; this.lastHit = 0
			this.value[d.method](v)
			if (this.cursor < digits.length - 1) this.cursor++
		}

		this.render()
	}



	, renderDigits: function () {
		let str = ''
		for (let i = 0; i < digits.length; i++) {
			let digit = digits[i]
			str += (!this.done && i === this.cursor)
				? chalk.cyan.underline(this.value.format(digit.format))
				: this.value.format(digit.format)
			str += digit.separator || ' '
		}
		return str
	}

	// todo: show cursor at digit
	, render: function () {
		process.stdout.write(esc.eraseLine + esc.cursorTo(0)
		+ esc.cursorHide + [
			  ui.symbol(this.done, this.aborted)
			, chalk.bold(this.msg), ui.delimiter(false)
			, this.renderDigits(this.value, this.cursor, this.done)
		].join(' '))
	}
}



const defaults = {
	  msg:      ''
	, value:    moment()

	, cursor:   0
	, typed:    ''
	, lastHit:  0

	, done:     false
	, aborted:  false
}

const create = (msg, opt) => {
	if ('string' !== typeof msg) throw new Error('Message must be string.')
	if (Array.isArray(opt) || 'object' !== typeof opt) opt = {}

	if ('number' === typeof opt.cursor && 0 < opt.cursor <= (digits.length - 1))
		opt.cursor = parseInt(opt.cursor)
	else opt.cursor = 0

	let p = Object.assign(Object.create(DatePrompt), defaults, opt)
	p.msg          = msg
	p.initialValue = p.value

	return wrap(p)
}



module.exports = Object.assign(create, {DatePrompt})
