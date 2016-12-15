const { parse } = require('./parser')
const ev = require('./eval')
const { root } = require('./env')
const factory = require('./factory')
const { readFileSync } = require('fs')

const files = process.argv.slice(2)

files
	.map(f => readFileSync(f, 'utf8'))
	.map(source => parse(source, factory))
	.map(ast => ev(ast, root))
