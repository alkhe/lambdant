const escape = id => id.replace(/\+/g, '_')

const af = {
	id: name => ({
		type: 'ID',
		name: escape(name)
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
	})
}

module.exports = af
