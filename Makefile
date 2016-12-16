all: build example

build:
	node ./node_modules/jison/lib/cli.js ./lang/grammar.g ./lang/lexer.l -o ./src/parser.js

example:
	node ./tools/compile examples/main.lm | node
