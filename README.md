# lambdant
A Javascript dialect for modern functional programming.

## Get

Globally install the cli tools:

```sh
# npm i -g lambdant
```

Locally install the [standard library](https://github.com/edge/stdlm):

```sh
$ npm i stdlm
```

## Hello World

`hello.lm`
```js
&'Hello, world!'
```

```sh
$ lm e hello.lm
  'Hello, world!'
```

## Files

- `./lang/grammar.g` contains the Jison grammar
- `./lang/lexer.l` contains the Jison lex file
- `./src/parser.js` is the parser script, compiled by `jison ./lang/grammar.g ./lang/lexer.l -o .src/parser.js`
- `./src/gen.js` generates an ESTree compliant Javascript ast given a Lambdant ast
- `./src/index.js` exposes three API calls:
  - `parse(LambdantSource) -> LambdantAST` parses a Lambdant source string and returns a Lambdant ast
  - `generate(LambdantAST) -> ESTreeAST` converts a Lambdant ast into an ESTree ast
  - `serialize(ESTreeAST) -> JavascriptSource` generates Javascript source from an ESTree ast

## Usage

### CLI

**dump:** dump Lambdant source, Lambdant ast, ESTree ast, and Javascript source for a Lambdant file
```sh
$ lm d file.lm
```

**compile:** transform Lambdant source file into Javascript and write it to stdout
```sh
$ lm c file.lm
```

**eval:** transform Lambdant source file into Javascript and run it in a new node process
```sh
$ lm e file.lm
```

**eval-arg:** transform Lambdant source string into Javascript and run it in a new node process
```sh
$ lm a '& Math.log10 1000'
  3
```

### Node

```js
import { parse, generate, serialize } from 'lambdant'
import { readFileSync as read, writeFileSync as write } from 'fs'

const source = read('script.lm', 'utf8')
const lm_ast = parse(source)
const es_ast = generate(lm_ast)
const js_source = serialize(es_ast)

write('script.js', js_source)
```

### Note
These commands will automatically prepend an import statement for the standard library to each Lambdant source file. This is useful for testing and development, but not recommended for production code. To opt out, suffix the mode argument with a dash:
```sh
$ lm d- file.lm # dump file.lm without implicit prelude
$ lm c- file.lm # compile file.lm without implicit prelude
$ lm e- file.lm # evaluate file.lm without implicit prelude
$ lm a- 'code' # evaluate code without implicit prelude
```


## Goals
- mutation allowed, but discouraged
- easy and intuitive javascript ffi by producing javascript code and using curry/uncurry
- promote functional programming techniques
- general-purpose functional scripting

## Language

### Operator Associativity/Precedence
```
()
.
!
application
* !!
:
&
```

### Values
```js
2 -> 2
'abc' -> 'abc'
() -> null
<1, 2, 3> -> [1, 2, 3]
```

### Expressions
[`$.add`](https://github.com/edge/stdlm#add)
```js
$.add 2 3 -> 5
console.log() // null
console.log! // (newline)
```

### Comments
```js
# this is a comment
```

### Lambdas
[`$.add`](https://github.com/edge/stdlm#add)
```js
[x: $.add 2 x] 3 -> 5
[x:[y: $.add x y]] 2 3 -> 5
[x y: $.add x y] 2 3 -> 5
[: log 'in a thunk!']! // in a thunk!
[:] -> (noop)
[x y, $.add x y] !! <1, 2> -> 3
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
Date.now! -> 1481926731041
<1, 9, 8, 4>.(2) -> 8
```

## Javascript FFI

### Constructors
Javascript `new` has unconventional function call semantics; its arity changes depending on the context of the expression.

```js
new (Date) // <Date>
new (Date)() // <Date>
const now = new Date
now() // Error!
```

It is best to use a function with better defined arity, like [`$.create`](https://github.com/edge/stdlm#create):
```js
($.create Array <5>).fill 0 -> [0, 0, 0, 0, 0]
```

### Multivariate Functions
The standard library provides currying and uncurrying facilities up to 5-arity.  
[`$.add`](https://github.com/edge/stdlm#add)
[`$.uncurry2`](https://github.com/edge/stdlm#uncurry2)
[`$.curry3`](https://github.com/edge/stdlm#curry3)
```js
$.uncurry2 [x y: $.add x y] !! <1, 2> -> 3
$.curry3 Date.UTC 1982 9 1 -> 402278400000
((Array 5).fill 0).map ($.uncurry2 [- i: i]) -> [0, 1, 2, 3, 4]
```

You can also use multivariate lambda literals and spreads for multivariate calls.  
[`$.sum`](https://github.com/edge/stdlm#sum)
```js
[x y z, $.sum <x, y, z>] !! <1, 2, 3> -> 6
((Array 5).fill 0).map [- i, i] -> [0, 1, 2, 3, 4]
```

### Native Combinators

#### T-combinator (`*`)
reverse application  
[`$.add`](https://github.com/edge/stdlm#add)
```js
(2 * $.add) 1 -> 3
```

infix expressions  
[`$.add`](https://github.com/edge/stdlm#add)
```js
$.add 2 3 -> 5
2 *$.add 3 -> 5
3 *[x: $.add 2 x] -> 5
```

reverse postfix expressions  
[`$.add`](https://github.com/edge/stdlm#add)
```js
3 *(2 *$.add) -> 5
```

#### B-combinator (`:`)
Composes functions.
```js
($.add 2 : $.add 1) 3 -> 6
```

#### P-combinator (`&`)
Prints and returns the argument.  
This combinator has the lowest precedence -- to avoid confusion, place a space between the combinator and the expression if the expression contains a space and is not delimited.  
Calls [`$.log`](https://github.com/edge/stdlm#log) under the hood; reassigning `$` will break this functionality.
[`$.add`](https://github.com/edge/stdlm#add)
```js
&42 -> 42 // 42
& $.add 40 2 -> 42 // 42
&($.add 40 2) -> 42 // 42
```

#### E-combinator (`!`)
Evaluates a thunk. (Calls a function with zero arguments.)  
This is preferable to calling with null (`()`).
```js
process.exit!
```

#### A'-combinator (`!!`)
Applies a sequence to a multivariate function. (Spreads an array into a function.)  
Useful for Javascript FFI.
```js
Date.UTC !! <1982, 9, 1> -> 402278400000
```

## Scripts

`make build` generates ./src/parser.js from ./lang/grammar.g and ./lang/lexer.l.  
`make suite` evaluates each of the scripts in ./examples.  

## TODO
- add object literals
