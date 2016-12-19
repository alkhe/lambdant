all: build suite

build:
	node ./node_modules/jison/lib/cli.js ./lang/grammar.g ./lang/lexer.l -o ./src/parser.js

suite:
	for i in ./examples/*; do node ./cli.js e $$i; done
