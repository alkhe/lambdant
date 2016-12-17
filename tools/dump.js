#!/usr/bin/env node

const { parse, generate } = require('../src')
const { readFileSync } = require('fs')

const files = process.argv.slice(2)
const peek = x => (console.dir(x, { depth: null, colors: true }), x)

files
	.map(f => readFileSync(f, 'utf8')).map(peek)
	.map(parse).map(peek)
	.map(generate).map(peek)
