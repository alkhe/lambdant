const { parse } = require('./parser')
const factory = require('./factory')
const gen = require('./gen')
const { generate } = require('escodegen')

module.exports = {
	parse: source => parse(source, factory),
	generate: gen,
	serialize: generate
}
