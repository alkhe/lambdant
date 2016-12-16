const {
	literal,
	identifier,
	array_expression,
	call_expression,
	arrow_function_expression,
	block_statement,
	expression_statement,
	variable_declaration,
	variable_declarator,
	assignment_expression,
	return_statement,
	unary_expression
} = require('./estree-factory')

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
		case 'LAMBDA': {
			const body_ast = gen(node.expr)
			return arrow_function_expression(
				[gen(node.arg)],
				body_ast,
				body_ast.type !== 'BlockStatement'
			)
		}
		case 'THUNK': {
			const body_ast = gen(node.expr)
			return arrow_function_expression(
				[],
				body_ast,
				body_ast.type !== 'BlockStatement'
			)
		}
		case 'SEQ': {
			const { exprs } = node

			if (exprs.length > 1) {
				const es_asts = []

				for (let i = 0; i < exprs.length - 1; i++) {
					es_asts.push(gen(exprs[i]))
				}

				const last_ast = gen(exprs[exprs.length - 1])

				es_asts.push(node.void ? last_ast : return_statement(last_ast))

				return block_statement(es_asts)
			} else if (exprs.length === 1) {
				const expr_ast = gen(exprs[0])
				return node.void ? unary_expression('void', true, expr_ast) : expr_ast
			}

			return block_statement([])
		}
	}
	throw new Error(`unrecognized node type: ${ node.type }`)
}

module.exports = node => {
	const body_ast = gen(node)
	return call_expression(
		arrow_function_expression([], body_ast, body_ast.type !== 'BlockStatement'),
		[]
	)
}
