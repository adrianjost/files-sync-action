const core = require("@actions/core");

const logger = require("./log");

// TODO: check that all required envs are defined

// TODO: check that tmp directory does not exist already
// shuffle name or clean directory

// TODO: validate that SRC_REPO is not in TARGET_REPOS

// TODO: add JSDoc comment
const parseMultilineInput = (multilineInput) => {
	return multilineInput.split("\n").map((e) => e.trim());
};

module.exports = {
	get COMMIT_MESSAGE() {
		return `Update file(s) from \"${this.SRC_REPO}\"`;
	},
	DRY_RUN: ["1", "true"].includes(
		core.getInput("DRY_RUN", { required: false }).toLowerCase()
	),
	FILE_PATTERNS: parseMultilineInput(core.getInput("FILE_PATTERNS")).map(
		(s) => new RegExp(s)
	),
	GITHUB_TOKEN: core.getInput("GITHUB_TOKEN", { required: true }),
	GIT_EMAIL:
		core.getInput("GIT_EMAIL") ||
		`${process.env.GITHUB_ACTOR}@users.noreply.github.com`,
	GIT_USERNAME:
		core.getInput("GIT_USERNAME", { required: false }) ||
		process.env.GITHUB_ACTOR,
	SKIP_CLEANUP: ["1", "true"].includes(
		core.getInput("SKIP_CLEANUP", { required: false }).toLowerCase()
	),
	SKIP_DELETE: ["1", "true"].includes(
		core.getInput("SKIP_DELETE", { required: false }).toLowerCase()
	),
	SRC_REPO:
		core.getInput("SRC_REPO", { required: false }) ||
		process.env.GITHUB_REPOSITORY,
	TARGET_REPOS: parseMultilineInput(
		core.getInput("TARGET_REPOS", { required: true })
	),
	TMPDIR:
		core.getInput("TEMP_DIR", { required: false }) ||
		`tmp-${Date.now().toString()}`,
};
