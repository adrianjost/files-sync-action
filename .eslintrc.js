module.exports = {
	extends: ["prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": ["error"],
		"sort-keys": ["error"],
	},
	parserOptions: {
		ecmaVersion: 2017,
	},
	env: {
		es6: true,
	},
};
