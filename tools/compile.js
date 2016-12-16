const { generate } = require('escodegen')
const { readFileSync } = require('fs')
const { parse } = require('../src/parser')
const gen = require('../src/gen')
const factory = require('../src/factory')

const files = process.argv.slice(2)

const out = [readFileSync('./lang/std.js', 'utf8')].concat(
	files
		.map(f => readFileSync(f, 'utf8'))
		.map(source => parse(source, factory))
		.map(gen)
		.map(generate)
).join(';')

process.stdout.write(out)
