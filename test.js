'use strict'

const datePrompt = require('./index.js')



console.log([
	'',
	'When testing `date-prompt`, please check the following:',
	' - the cursor can be moved by hitting left/right arrow keys',
	' - the cursor can be moved to the left by hitting Alt + B',
	' - the cursor can be moved to the right by hitting Alt + F',
	' - the cursor can be moved to the right by hitting Tab / Ctrl + I',
	' - the cursor can be moved to the beginning by hitting Ctrl + A',
	' - the cursor can be moved to the end by hitting Ctrl + E',
	' - the current digit can be changed by hitting up/down arrow keys',
	'    - when incrementing minutes on "6:59", the hour increments',
	'    - when incrementing hours on "23:00", the day & date increment',
	'    - when incrementing days on "31 Jan", the month increments',
	'    - when incrementing months on "Dec", the year increments instead',
	' - the prompt can be aborted by hitting Ctrl + C / Escape',
	' - the REPL can be stopped by hitting Ctrl + D',
	' - the prompt can be submitted by hitting Ctrl + J / Return',
	' - the prompt can be reset by hitting Ctrl + G',
	' - the current digit can be changed by typing a number',
	'    - the input is reset after 1 second',
	'    - the input is applied after all digits have been typed',
	'    - after the input has been applied, the cursor is moved to the right',
	' - the prompt shows a question mark before submit',
	' - the prompt shows a check mark after submit',
	' - the prompt shows a cross after abort',
	''
].join('\n'))



datePrompt('When is your birthday?', {cursor: 3})
.then(function (value) {
	process.stdout.write(new Date(value) + '\n')
})
