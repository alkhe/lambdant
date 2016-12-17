# lambdant
A Javascript dialect for modern functional programming.

## Files

- lang/grammar.g contains the Jison grammar
- lang/lexer.l contains the Jison lex file
- parser.js is the parser script, compiled by `jison ./lang/grammar.g ./lang/lexer.l -o .src/parser.js`
- gen.js generates an ESTree compliant Javascript ast given a Lambdant ast

## Goals
- mutation allowed, but discouraged
- easy and intuitive javascript ffi by producing javascript code and using curry/uncurry
- promote functional programming techniques
- general-purpose functional scripting

## Hello World

```js
&'Hello, world!' // Hello, world!
```

## Language

### Values
```js
2 -> 2
'abc' -> 'abc'
() -> null
<1, 2, 3> -> [1, 2, 3]
```

### Expressions
```js
add 2 3 -> 5
console.log() // null
console.log! // (newline)
```

### Lambdas
```js
[x: plus 2 x] 3 -> 5
[x:[y: plus x y]] 2 3 -> 5
[x y: plus x y] 2 3 -> 5
[: log 'in a thunk!']! // in a thunk!
[:] -> (noop)
```

### Blocks
Every statement in a block, except for the last, must be semicolon-terminated.

If the last expression is terminated, the function will return undefined, otherwise, it will return the expression.
```js
@write = process.stdout.write : String;
write 'This will not return: ';
write [: 42;]!;
console.log!;
write 'This will return: ';
write [: 42]!;
console.log!

// This will not return: undefined
// This will return: 42
```

### Declaration
```js
@declared
```

### Definition
```js
@name = 'John'
name -> 'John'
```

### Assignment
```js
@w;
w = 5;
w -> 5
```

### Members
```js
@- = require 'lodash';
-.now! -> 1481926731041
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

**B-combinator** (`:`)
Composes functions.
```js
(plus 2 : inc) 3 -> 6
```

**P-combinator** (`&`)
Prints and returns the argument.
```js
&(plus 40 2) // 42
```

**E-combinator** (`!`)
Evaluates a thunk. (Calls a function with zero arguments.)
```js
process.exit!
```

**A-combinator** (`!!`)
Applies a sequence to a multivariate function. (Spreads an array into a function.) Useful for Javascript ffi.
```js
Date.UTC !! <1982, 9, 1> -> 402278400000
```

## Scripts

`make build` generates ./src/parser.js from ./lang/grammar.g and ./lang/lexer.l.

`make suite` evaluates each of the scripts in ./examples.

`node tools/dump file.lm` ouptuts the source, Lambdant ast, and estree ast of a Lambdant script.

`node tools/compile file.lm` compiles a Lambdant script, printing the Javascript on stdout, can be written to a Javascript file or piped to node

## TODO
- add object and array literals
- add multivariate function calls
