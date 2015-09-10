# date-prompt

A CLI date picker prompt.

[![npm version](https://img.shields.io/npm/v/date-prompt.svg)](https://www.npmjs.com/package/date-prompt)
[![dependency status](https://img.shields.io/david/derhuerst/date-prompt.svg)](https://david-dm.org/derhuerst/date-prompt)



## Installing

```shell
npm install date-prompt
```



## Usage

```javascript
var datePrompt =	require('../src/index');

datePrompt()
.date.then(function (value) {
	console.log('\n', value.format());
});
```



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/date-prompt/issues).
