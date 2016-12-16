all: build example

build:
	jison grammar.g lexer.l -o parser.js

example:
	node cli-compile examples/main.lm | node
