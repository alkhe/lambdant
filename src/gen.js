const {
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
	spread_element,
	object_expression,
	property,
	conditional_expression
} = require('./estree-factory')

const STD_ID = identifier('$')
const LOG_ID = identifier('log')
const __ARG_ID = identifier('__arg')
const STD_LOG = member_expression(STD_ID, LOG_ID, false)
const debug_expression = expression => call_expression(STD_LOG, [expression])

const compose_functions = fns => {
	const chain = fns.reduceRight(
		(arg, fn) => call_expression(gen(fn), [arg]),
		__ARG_ID
	)

	return arrow_function_expression(
		[__ARG_ID],
		chain,
		true
	)
}

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
		case 'ARRAY':
			return array_expression(node.exprs.map(gen))
		case 'OBJECT':
			return object_expression(node.entries.map(gen))
		case 'ENTRY':
			return property(gen(node.key), gen(node.value), node.computed, false)
		case 'SHORTENTRY':
			return property(gen(node.key), {}, false, true)
		case 'ACCESS':
			return member_expression(gen(node.object), gen(node.property), node.computed)
		case 'EXPR': {
			const fn_ast = gen(node.fn)
			return (fn_ast.type === 'ID' && fn_ast.name === 'new' ? new_expression : call_expression)(fn_ast, [gen(node.arg)])
		}
		case 'BANGEXPR':
			return call_expression(
				gen(node.fn),
				[]
			)
		case 'APPLY':
			return call_expression(
				gen(node.fn),
				[spread_element(gen(node.arg))]
			)
		case 'COMPOSE':
			return compose_functions(node.fns)
		case 'DEBUG':
			return debug_expression(gen(node.expr))
		case 'DECLARE':
			return variable_declaration(gen(node.id), null)
		case 'DEFINE':
			return variable_declaration(gen(node.pattern), gen(node.expr))
		case 'ASSIGN':
			return assignment_expression(gen(node.pattern), gen(node.expr))
		case 'LAMBDA': {
			const body_ast = gen(node.expr)
			return arrow_function_expression(
				node.args.map(gen),
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
					const ast = gen(exprs[i])
					const ast_type = ast.type
					es_asts.push(ast_type === 'CallExpression' || ast_type === 'AssignmentExpression'
						? expression_statement(ast)
						: ast
					)
				}

				const last_ast = gen(exprs[exprs.length - 1])

				es_asts.push(node.void ? last_ast : return_statement(last_ast))

				return block_statement(es_asts)
			} else if (exprs.length === 1) {
				const expr_ast = gen(exprs[0])
				return expr_ast.type === 'VariableDeclaration'
					? block_statement([expr_ast])
					: node.void
						? unary_expression('void', true, expr_ast)
						: expr_ast
			}

			return block_statement([])
		}
		case 'CONDITIONAL':
			return conditional_expression(gen(node.test), gen(node.consequent), gen(node.alternative))
	}
	throw new Error(`unrecognized node type: ${ node.type } on node ${ node }`)
}

module.exports = node => {
	const body_ast = gen(node)
	return call_expression(
		arrow_function_expression([], body_ast, body_ast.type !== 'BlockStatement'),
		[]
	)
}
