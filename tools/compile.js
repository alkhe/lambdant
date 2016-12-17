const { readFileSync } = require('fs')
const { parse, generate, serialize } = require('../src')

const files = process.argv.slice(2)

const out = [readFileSync('./lang/std.js', 'utf8')].concat(
	files.map(f => readFileSync(f, 'utf8'))
		.map(s => serialize(generate(parse(s))))
).join(';')

process.stdout.write(out)
