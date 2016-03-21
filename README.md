# date-prompt 📅

A CLI prompt to ask for date & time.

[![asciicast](https://asciinema.org/a/26269.png)](https://asciinema.org/a/26269)

[![npm version](https://img.shields.io/npm/v/date-prompt.svg)](https://www.npmjs.com/package/date-prompt)
[![dependency status](https://img.shields.io/david/derhuerst/date-prompt.svg)](https://david-dm.org/derhuerst/date-prompt)

*date-prompt* uses [*cli-styles*](https://github.com/derhuerst/cli-styles) to have a look & feel consistent with other prompts.



## Installing

```shell
npm install date-prompt
```



## Usage

```javascript
var datePrompt =	require('date-prompt');

datePrompt()
.date.then(function (value) {
	// user submitted
})
.catch(function () {
	// user aborted
});
```



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/date-prompt/issues).
