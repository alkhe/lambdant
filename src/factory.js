const af = {
	id: name => ({
		type: 'ID',
		name
	}),
	number: n => ({
		type: 'NUMBER',
		value: Number(n)
	}),
	value: value => ({
		type: 'VALUE',
		value
	}),
	array: {
		type: 'ARRAY',
		exprs: []
	},
	arrayadd: (array, expr) => ({
		type: 'ARRAY',
		exprs: array.exprs.concat(expr)
	}),
	expr: (fn, arg) => ({
		type: 'EXPR',
		fn,
		arg
	}),
	bangexpr: fn => ({
		type: 'BANGEXPR',
		fn
	}),
	apply: (fn, arg) => ({
		type: 'APPLY',
		fn,
		arg
	}),
	debug: expr => ({
		type: 'DEBUG',
		expr
	}),
	fn: (args, expr) => {
		const len = args.length
		let l = af.lambda([args[len - 1]], expr)
		for (let i = len - 2; i >= 0; i--) {
			l = af.lambda([args[i]], l)
		}
		return l
	},
	lambda: (args, expr) => ({
		type: 'LAMBDA',
		args,
		expr
	}),
	thunk: expr => ({
		type: 'THUNK',
		expr
	}),
	objectentry: (key, value, computed) => ({
		type: 'ENTRY',
		key,
		value,
		computed
	}),
	shortentry: key => ({
		type: 'SHORTENTRY',
		key
	}),
	object: {
		type: 'OBJECT',
		entries: []
	},
	objectadd: (object, entry) => ({
		type: 'OBJECT',
		entries: object.entries.concat(entry)
	}),
	compose: (left, right) => ({
		type: 'COMPOSE',
		fns: left.type === 'COMPOSE'
			? left.fns.concat(right)
			: [left, right]
	}),
	seqadd: (seq, statement) => ({
		type: 'SEQ',
		exprs: seq.exprs.concat(statement),
		void: false
	}),
	nullseq: {
		type: 'SEQ',
		exprs: [],
		void: true
	},
	voidseq: seq => ({
		type: 'SEQ',
		exprs: seq.exprs,
		void: true
	}),
	declare: id => ({
		type: 'DECLARE',
		id
	}),
	define: (pattern, expr) => ({
		type: 'DEFINE',
		pattern,
		expr
	}),
	assign: (pattern, expr) => ({
		type: 'ASSIGN',
		pattern,
		expr
	}),
	access: (object, property, computed) => ({
		type: 'ACCESS',
		object,
		property,
		computed
	}),
	conditional: (test, consequent, alternative) => ({
		type: 'CONDITIONAL',
		test,
		consequent,
		alternative
	})
}

module.exports = af
