const { parse } = require('./parser')
const ev = require('./eval')
const gen = require('./gen')
const { generate } = require('escodegen')
const { root: env } = require('./env')

const escape = id => id.replace(/\+/g, '_')

// ast factories
const af = {
	id: name => ({
		type: 'ID',
		name: escape(name)
	}),
	value: value => ({
		type: 'VALUE',
		value
	}),
	expr: (fn, arg) => ({
		type: 'EXPR',
		fn,
		arg
	}),
	fn: (args, expr) => {
		const len = args.length
		let l = af.lambda(args[len - 1], expr)
		for (let i = len - 2; i >= 0; i--) {
			l = af.lambda(args[i], l)
		}
		return l
	},
	lambda: (arg, expr) => ({
		type: 'LAMBDA',
		arg,
		expr
	})
}

const ast = parse('7 #[x y: x #plus y] 5', af)
const result = ev(ast, env)

console.dir(ast, { depth: null, colors: true })
console.log('result', result)

const es_ast = gen(ast)
console.log(es_ast)
console.log(generate(es_ast))
