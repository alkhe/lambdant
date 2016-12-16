const literal = value => ({ type: 'Literal', value })

const identifier = name => ({ type: 'Identifier', name })

const array_expression = elements => ({ type: 'ArrayExpression', elements })

const call_expression = (callee, arguments) => ({ type: 'CallExpression', callee, arguments })

const arrow_function_expression = (params, body) => ({ type: 'ArrowFunctionExpression', params, body })

const block_statement = body => ({ type: 'BlockStatement', body })

const expression_statement = expression => ({ type: 'ExpressionStatement', expression })

const variable_declaration = (left, right) => ({
	type: 'VariableDeclaration',
	declarations: [variable_declarator(left, right)],
	kind: 'let'
})

const variable_declarator = (id, init) => ({ type: 'VariableDeclarator', id, init })

const assignment_expression = (left, right) => ({ type: 'AssignmentExpression', operator: '=', left, right })

const return_statement = argument => ({ type: 'ReturnStatement', argument })

const unary_expression = (operator, prefix, argument) => ({ type: 'UnaryExpression', operator, prefix, argument })

const gen = node => {
	switch (node.type) {
		case 'ID':
			return identifier(node.name)
		case 'NUMBER': {
			const { value } = node
			return value < 0
				? unary_expression('-', true, literal(-value))
				: literal(value)
		}
		case 'VALUE':
			return literal(node.value)
		case 'EXPR':
			return call_expression(
				gen(node.fn),
				[gen(node.arg)]
			)
		case 'DECLARE':
			return variable_declaration(gen(node.id), null)
		case 'DEFINE':
			return variable_declaration(gen(node.id), gen(node.expr))
		case 'ASSIGN':
			return assignment_expression(gen(node.id), gen(node.expr))
		case 'LAMBDA':
			return arrow_function_expression(
				[gen(node.arg)],
				gen(node.expr)
			)
		case 'THUNK':
			return arrow_function_expression(
				[],
				gen(node.expr)
			)
		case 'SEQ': {
			const asts = node.exprs.map(gen)
			const es_asts = []
			for (let i = 0; i < asts.length - 1; i++) {
				es_asts.push(expression_statement(asts[i]))
			}
			es_asts.push(
				(node.void ? expression_statement : return_statement)(asts[asts.length - 1])
			)
			return block_statement(es_asts)
		}
	}
	throw new Error(`unrecognized node type: ${ node.type }`)
}

module.exports = node =>
	call_expression(
		arrow_function_expression([], gen(node)),
		[]
	)
