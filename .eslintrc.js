module.exports = {
	env: {
		es6: true,
	},
	extends: ["prettier"],
	parserOptions: {
		ecmaVersion: 2018,
	},
	plugins: ["prettier", "sort-keys-fix"],
	rules: {
		"no-unused-vars": ["error"],
		"prettier/prettier": ["error"],
		"sort-keys-fix/sort-keys-fix": ["error"],
	},
};
