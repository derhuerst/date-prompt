# date-prompt 📅

**A CLI prompt to ask for date & time.**

[![asciicast](https://asciinema.org/a/26269.png)](https://asciinema.org/a/26269)

[![npm version](https://img.shields.io/npm/v/date-prompt.svg)](https://www.npmjs.com/package/date-prompt)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/date-prompt.svg)
![minimum Node.js version](https://img.shields.io/node/v/date-prompt.svg)


## Installing

```shell
npm install date-prompt
```


## Usage

```js
const datePrompt = require('date-prompt')

datePrompt('When is your birthday?')
.then(val => console.log('Submitted with', val))
.catch(val => console.log('Aborted with', val))
```


## Related

- [`enquirer`](https://github.com/enquirer/enquirer) – Stylish, intuitive and user-friendly prompts.
- [`mail-prompt`](https://github.com/derhuerst/mail-prompt)
- [`range-prompt`](https://github.com/derhuerst/range-prompt)
- [`tree-select-prompt`](https://github.com/derhuerst/tree-select-prompt)
- [`cli-autocomplete`](https://github.com/derhuerst/cli-autocomplete)


## Contributing

If you have a question or need support using `date-prompt`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/date-prompt/issues).
