# date-prompt 📅

**A CLI prompt to ask for date & time.**

[![asciicast](https://asciinema.org/a/26269.png)](https://asciinema.org/a/26269)

[![npm version](https://img.shields.io/npm/v/date-prompt.svg)](https://www.npmjs.com/package/date-prompt)
[![dependency status](https://img.shields.io/david/derhuerst/date-prompt.svg)](https://david-dm.org/derhuerst/date-prompt)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/date-prompt.svg)

*date-prompt* uses [*cli-styles*](https://github.com/derhuerst/cli-styles) and [*prompt-skeleton*](https://github.com/derhuerst/prompt-skeleton) to have a look & feel consistent with [other prompts](https://github.com/derhuerst/prompt-skeleton#prompts-using-prompt-skeleton).


## Installing

```shell
npm install date-prompt
```


## Usage

```js
const numberPrompt = require('date-prompt')
datePrompt()
.on('data', (v) => console.log('Interim value', v))
.on('submit', (v) => console.log('Submitted with', v))
.on('abort', (v) => console.log('Aborted with', v))
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/date-prompt/issues).
