var datePrompt = require('./index.js');



console.log([
	'',
	'When testing `date-prompt`, please check the following:',
	' - the cursor can be moved by hitting left/right arrow keys',
	' - the cursor can be moved by hitting Tab',
	' - the current digit can be changed by hitting up/down arrow keys',
	'    - when incrementing minutes on "6:59", the hour increments instead',
	'    - when incrementing hours on "23:00", the day & date increment instead',
	'    - when incrementing days on "31 Jan", the month increments instead',
	'    - when incrementing months on "Dec", the year increments instead',
	' - the prompt can be aborted by hitting Ctrl + C',
	' - the prompt can be aborted by hitting Escape',
	' - the prompt can be submitted by hitting Return',
	' - the current digit can be changed by typing a number',
	'    - the input is reset after 1 second',
	'    - the input is applied after all digits have been typed',
	'    - after the input has been applied, the cursor is moved to the right',
	' - the prompt shows a question mark before submit',
	' - the prompt shows a check mark after submit',
	''
].join('\n'));



datePrompt('When is your birthday?', {cursor: 3})
	.then(function (value) {
		console.log(new Date(value), '\n');
	});
