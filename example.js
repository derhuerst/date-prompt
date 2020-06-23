'use strict'

const datePrompt = require('.')

datePrompt('When is your birthday?')
.then(isoStr => console.log('Submitted with', isoStr))
.catch(isoStr => console.log('Aborted with', isoStr))
