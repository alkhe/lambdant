all: build

build:
	jison grammar.g lexer.l -o parser.js

