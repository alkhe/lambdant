const literal = value => ({ type: 'Literal', value })
const identifier = name => ({ type: 'Identifier', name })
const array_expression = elements => ({ type: 'ArrayExpression', elements })
const call_expression = (callee, arguments) => ({ type: 'CallExpression', callee, arguments })
const arrow_function_expression = (params, body) => ({ type: 'ArrowFunctionExpression', params, body })

const gen = node => {
	switch (node.type) {
		case 'ID':
			return identifier(node.name)
		case 'VALUE':
			return literal(node.value)
		case 'EXPR':
			return call_expression(
				gen(node.fn),
				[gen(node.arg)]
			)
		case 'LAMBDA':
			return arrow_function_expression(
				[identifier(node.arg)],
				gen(node.expr)
			)
	}
	throw new Error('unrecognized node type')
}

module.exports = gen
