all: build run

build:
	jison grammar.g lexer.l -o parser.js

run:
	node cli-run example.lm
