const env = new Map([
	['+', a => b => a + b],
	['-', a => b => a - b],
	['neg', x => -x],
	['inc', x => x + 1],
	['dec', x => x - 1]
])

function ev(node) {
	switch (node.type) {
		case 'ID':
			return env.get(node.name)
		case 'VALUE':
			return node.value
		case 'EXPR':
			return ev(node.fn)(ev(node.arg))
	}
	throw new Error('unrecognized node type')
}

module.exports = ev
