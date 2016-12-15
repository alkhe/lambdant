const { parse } = require('./parser')
const ev = require('./eval')

// ast factories
const af = {
	id: name => ({
		type: 'ID',
		name
	}),
	value: value => ({
		type: 'VALUE',
		value
	}),
	expr: (fn, arg) => ({
		type: 'EXPR',
		fn,
		arg
	})
}

const ast = parse('neg (inc 2)', af)
const result = ev(ast)

console.dir(ast, { depth: null, colors: true })
console.log('result', result)
