const escape = id => id.replace(/\-/g, '_')

const af = {
	id: name => ({
		type: 'ID',
		name: escape(name)
	}),
	number: n => ({
		type: 'NUMBER',
		value: Number(n)
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
	bangexpr: fn => ({
		type: 'BANGEXPR',
		fn
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
	}),
	thunk: expr => ({
		type: 'THUNK',
		expr
	}),
	seqadd: (seq, statement) => ({
		type: 'SEQ',
		exprs: seq.exprs.concat(statement),
		void: seq.void
	}),
	nullseq: {
		type: 'SEQ',
		exprs: [],
		void: false
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
	define: (id, expr) => ({
		type: 'DEFINE',
		id,
		expr
	}),
	assign: (id, expr) => ({
		type: 'ASSIGN',
		id,
		expr
	}),
	access: (object, property, computed) => ({
		type: 'ACCESS',
		object,
		property,
		computed
	})
}

module.exports = af
