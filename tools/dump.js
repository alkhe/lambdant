const { generate } = require('escodegen')
const { readFileSync } = require('fs')
const { parse } = require('../src/parser')
const gen = require('../src/gen')
const factory = require('../src/factory')

const files = process.argv.slice(2)
const peek = x => (console.dir(x, { depth: null, colors: true }), x)

files
	.map(f => readFileSync(f, 'utf8'))
	.map(peek)
	.map(source => parse(source, factory))
	.map(peek)
	.map(gen)
	.map(peek)
