const path = require("path");
const core = require("@actions/core");

try {
	require("./envs");
} catch (e) {
	console.error(
		"failed to load envs. You can set env variables inside src/envs.js",
		e
	);
}

// TODO: check that all required envs are defined

// TODO: check that tmp directory does not exist already
// shuffle name or clean directory

// TODO: validate that SRC_REPO is not in TARGET_REPOS

// TODO: add JSDoc comment
const trimArray = (arr) => {
	return arr.map((e) => e.trim());
};

module.exports = {
	get COMMIT_MESSAGE() {
		return `Update file(s) from \"${this.SRC_REPO}\"`;
	},
	DRY_RUN: ["1", "true"].includes(
		core.getInput("DRY_RUN", { required: false }).toLowerCase()
	),
	FILE_PATTERNS: trimArray(core.getInput("FILE_PATTERNS").split("\n")).map(
		(s) => new RegExp(s)
	),
	GIT_EMAIL:
		core.getInput("GIT_EMAIL") ||
		`${process.env.GITHUB_ACTOR}@users.noreply.github.com`,
	GIT_PERSONAL_TOKEN: core.getInput("PERSONAL_TOKEN", { required: true }),
	GIT_USERNAME:
		core.getInput("GIT_USERNAME", { required: false }) ||
		process.env.GITHUB_ACTOR,
	SKIP_CLEANUP: ["1", "true"].includes(
		core.getInput("SKIP_CLEANUP", { required: false }).toLowerCase()
	),
	SRC_REPO:
		core.getInput("SRC_REPO", { required: false }) ||
		process.env.GITHUB_REPOSITORY,
	TARGET_REPOS: trimArray(
		core.getInput("TARGET_REPOS", { required: true }).split("\n")
	),
	TMPDIR:
		core.getInput("TEMP_DIR", { required: false }) ||
		`tmp-${Date.now().toString()}`,
};
