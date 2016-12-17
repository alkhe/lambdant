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
```js
2 -> 2
'abc' -> 'abc'
() -> null
```

### Expressions
```js
add 2 3 -> 5
```

### Lambdas
```js
[x: plus 2 x] 3 -> 5
[x:[y: plus x y]] 2 3 -> 5
[x y: plus x y] 2 3 -> 5
```

### Assignment
```js
@name = 'John';
name -> 'John'
```

### Members
```js
@- = require 'lodash';
-:now() -> 1481926731041
```

### Native Combinators

**T-combinator** (`*`)
- reverse application
```js
2 * inc -> 3
```

- infix expressions
```js
plus 2 3 -> 5
2 *plus 3 -> 5
3 *[x: plus 2 x] -> 5
```

- reverse postfix expressions
```js
3 *(2 *plus) -> 5
```

**B-combinator** (`.`)
Composes functions.
```js
(add 2) . inc 3 -> 6
```

**P-combinator** (`&`)
Prints and returns the argument.
```js
&(plus 40 2) // 42
```

## Scripts

`node tools/dump file.lm` ouptuts the source, Lambdant ast, and estree ast of a Lambdant script.

`node tools/compile file.lm` compiles a Lambdant script, printing the Javascript on stdout, can be written to a Javascript file or piped to node

## TODO
- add object and array literals
- add multivariate function calls
- add more combinators
