const { get, extend } = require('./env')

function ev(node, env) {
	switch (node.type) {
		case 'ID':
			return get(env, node.name)
		case 'VALUE':
			return node.value
		case 'EXPR':
			return ev(node.fn, env)(ev(node.arg, env))
		case 'LAMBDA':
			return x => ev(
				node.expr,
				extend(env, [[node.arg, x]])
			)
	}
	throw new Error('unrecognized node type')
}

module.exports = ev
