const { parse } = require('./parser')
const gen = require('./gen')
const { generate } = require('escodegen')
const { readFileSync } = require('fs')
const factory = require('./factory')

const files = process.argv.slice(2)

const out = [readFileSync('./std.js', 'utf8')].concat(
	files
		.map(f => readFileSync(f, 'utf8'))
		.map(source => parse(source, factory))
		.map(gen)
		.map(generate)
).join(';')

process.stdout.write(out)
