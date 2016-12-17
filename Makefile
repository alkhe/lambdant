all: build suite

build:
	node ./node_modules/jison/lib/cli.js ./lang/grammar.g ./lang/lexer.l -o ./src/parser.js

suite:
	node ./tools/cli.js e ./examples/*
