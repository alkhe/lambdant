const { get, set, extend } = require('./env')

function ev(node, env) {
	switch (node.type) {
		case 'ID':
			return get(env, node.name)
		case 'VALUE':
			return node.value
		case 'EXPR':
			return ev(node.fn, env)(ev(node.arg, env))
		case 'ASSIGN': {
			const result = ev(node.expr, env)
			set(env, node.id.name, result)
			return result
		}
		case 'LAMBDA':
			return x => ev(
				node.expr,
				extend(env, [[node.arg, x]])
			)
		case 'SEQ': {
			const { exprs } = node

			for (let i = 0; i < exprs.length - 1; i++) {
				ev(exprs[i], env)
			}

			return ev(exprs[exprs.length - 1], env)
		}
	}
	throw new Error('unrecognized node type')
}

module.exports = ev
