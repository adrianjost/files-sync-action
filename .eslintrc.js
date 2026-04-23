module.exports = {
	env: {
		es6: true,
	},
	extends: ["prettier"],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["prettier", "sort-keys-fix", "node"],
	rules: {
		"no-unused-vars": ["error"],
		"prettier/prettier": ["error"],
		"sort-keys-fix/sort-keys-fix": ["error"],
	},
};
