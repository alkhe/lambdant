#!/usr/bin/env node

const { readFileSync } = require('fs')
const { resolve } = require('path')
const { parse, generate, serialize } = require(resolve(__dirname, '../src'))
const { spawn } = require('child_process')
const { red } = require('colors')

const [mode, ...files] = process.argv.slice(2)

const read = f => readFileSync(f, 'utf8')
const peek = x => (console.dir(x, { depth: null, colors: true }), x)

const DUMP_RULE = 'd'
const COMPILE_RULE = 'c'
const EVAL_RULE = 'e'
const EVAL_ARG_RULE = 'a'

const NO_PRELUDE = '-'

const prelude = `@$ = require 'stdlm';`

const pre_parse = s => mode.length > 1 && mode[1] === NO_PRELUDE
	? s
	: prelude + s

const generate_code = s => serialize(generate(parse(pre_parse(s))))

const no_files = () => console.log(red(`no input files`))
const bad_mode = mode => console.log(red(`unrecognized mode: ${ mode }`))

if (files.length < 1) {
	no_files()
} else if (!mode || mode.length < 1) {
	bad_mode(mode)
} else {
	switch (mode[0]) {
		case DUMP_RULE: {
			files
				.map(read).map(peek)
				.map(s => parse(pre_parse(s))).map(peek)
				.map(generate).map(peek)
				.map(serialize).map(peek)
			break
		}
		case COMPILE_RULE: {
			process.stdout.write(files.map(read).map(generate_code).join(';'))
			break
		}
		case EVAL_RULE: {
			const source = files.map(read).map(generate_code).join(';')
			const child = spawn('node', [], { stdio: ['pipe', 'inherit', 'inherit'] })
			child.stdin.write(source)
			child.stdin.end()
			break
		}
		case EVAL_ARG_RULE: {
			const source = files.map(generate_code).join(',')
			const child = spawn('node', [], { stdio: ['pipe', 'inherit', 'inherit'] })
			child.stdin.write(source)
			child.stdin.end()
			break
		}
		default:
			bad_mode(mode)
	}
}
