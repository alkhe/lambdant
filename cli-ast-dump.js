const { parse } = require('./parser')
const gen = require('./gen')
const { generate } = require('escodegen')
const { readFileSync } = require('fs')
const factory = require('./factory')

const files = process.argv.slice(2)
const peek = x => (console.dir(x, { depth: null, colors: true }), x)

files
	.map(f => readFileSync(f, 'utf8'))
	.map(source => parse(source, factory))
	.map(peek)
	.map(gen)
	.map(peek)
