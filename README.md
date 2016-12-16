# lambdant
A Javascript dialect for modern functional programming.

# Notes

## Files

- grammar.g contains the Jison grammar
- lexer.l contains the Jison lex file
- parser.js is the parser script, compiled by `jison grammar.g lexer.l -o parser.js`
- eval.js evaluates a parsed ast
- gen.js generates an ESTree compliant Javascript ast given a Lambdant ast

## Language

### Values
```lm
2 -> 2
```

### Expressions
```lm
add 2 3 -> 5
```

### Lambdas
```lm
[x: plus 2 x] 3 -> 5
[x:[y: plus x y]] 2 3 -> 5
[x y: plus x y] 2 3 -> 5
```

### Combinators

**T-combinator** (`#`)
- reverse application
```lm
2 # inc -> 3
```

- infix expressions
```lm
plus 2 3 -> 5
2 #plus 3 -> 5
3 #[x: plus 2 x] -> 5
```

- reverse postfix expressions
```lm
3 #(2 #plus) -> 5
```

## Scripts

`node cli-run file.lm` runs a Lambdant script.

`node cli-compile file.lm` compiles a Lambdant script, printing the Javascript on stdout, can be written to a Javascript file or piped to node
