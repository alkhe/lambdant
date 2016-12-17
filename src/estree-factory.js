const literal = value => ({ type: 'Literal', value })

const identifier = name => ({ type: 'Identifier', name })

const array_expression = elements => ({ type: 'ArrayExpression', elements })

const call_expression = (callee, arguments) => ({ type: 'CallExpression', callee, arguments })

const new_expression = (callee, arguments) => ({ type: 'NewExpresion', callee, arguments })

const arrow_function_expression = (params, body, expression) => ({ type: 'ArrowFunctionExpression', params, body, expression })

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

const member_expression = (object, property, computed) => ({ type: 'MemberExpression', object, property, computed })

const sequence_expression = expressions => ({ type: 'SequenceExpression', expressions })

const spread_element = argument => ({ type: 'SpreadElement', argument })

module.exports = {
	literal,
	identifier,
	array_expression,
	call_expression,
	new_expression,
	arrow_function_expression,
	block_statement,
	expression_statement,
	variable_declaration,
	variable_declarator,
	assignment_expression,
	return_statement,
	unary_expression,
	member_expression,
	sequence_expression,
	spread_element
}
