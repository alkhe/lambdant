const { parse } = require('./parser')

const env = new Map([
	['+', a => b => a + b],
	['-', a => b => a - b],
	['neg', x => -x],
	['inc', x => x + 1],
	['dec', x => x - 1]
])

const result = parse('inc (inc 2)', env)

console.log(result)
