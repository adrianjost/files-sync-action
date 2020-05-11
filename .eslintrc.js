module.exports = {
	extends: ["prettier"],
	plugins: ["prettier", "sort-keys-fix"],
	rules: {
		"no-unused-vars": ["error"],
		"prettier/prettier": ["error"],
		"sort-keys-fix/sort-keys-fix": ["error"],
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	env: {
		es6: true,
	},
};
