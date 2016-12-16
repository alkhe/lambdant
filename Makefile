all: build example

build:
	node ./node_modules/jison/lib/cli.js grammar.g lexer.l -o parser.js

example:
	node cli-compile examples/main.lm | node
