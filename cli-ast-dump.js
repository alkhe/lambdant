const { parse } = require('./parser')
const gen = require('./gen')
const { generate } = require('escodegen')
const { readFileSync } = require('fs')
const factory = require('./factory')

const files = process.argv.slice(2)

files
	.map(f => readFileSync(f, 'utf8'))
	.map(source => parse(source, factory))
	.map(gen)
	.forEach(ast => console.dir(ast, { depth: null, colors: true }))
