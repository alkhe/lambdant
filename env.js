const escape = id => id.replace(/\+/g, '_')

const root = {
	items: new Map([
		['plus', a => b => a + b],
		['minus', a => b => a - b],
		['neg', x => -x],
		['inc', x => x + 1],
		['dec', x => x - 1]
	]),
	parent: null
}

function get({ items, parent }, id) {
	if (items.has(id)) {
		return items.get(id)
	} else {
		if (parent == null) {
			throw new Error(`identifier ${ id } not found in scope`)
		} else {
			return get(parent, id)
		}
	}
}

function set(scope, id, value) {
	scope.items.set(id, value)
}

function extend(scope, entries) {
	return {
		items: new Map(entries),
		parent: scope
	}
}

module.exports = { root, get, set, extend }
