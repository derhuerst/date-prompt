'use strict'

const chalk =     require('chalk')
const figures =   require('figures')



const symbols = Object.freeze({
	aborted: chalk.red(figures.cross),
	done:    chalk.green(figures.tick),
	default: chalk.cyan('?')
})

const symbol = (done, aborted) =>
	aborted ? symbols.aborted : (done ? symbols.done : symbols.default)

const delimiter = chalk.gray('>')



module.exports = Object.freeze({symbols, symbol, delimiter})
