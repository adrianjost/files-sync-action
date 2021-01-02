const fs = require("fs");

const core = require("@actions/core");

const logger = require("./log")();

const parseMultilineInput = (multilineInput) => {
	return multilineInput.split("\n").map((e) => e.trim());
};

const context = {
	get COMMIT_MESSAGE() {
		return (
			core.getInput("COMMIT_MESSAGE", { required: false }) ||
			`Update file(s) from \"%SRC_REPO%\"`
		);
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
	SRC_ROOT: core.getInput("SRC_ROOT", { required: false }) || "/",
	TARGET_REPOS: parseMultilineInput(
		core.getInput("TARGET_REPOS", { required: true })
	),
	TARGET_ROOT: core.getInput("TARGET_ROOT", { required: false }) || "/",
	TMPDIR:
		core.getInput("TEMP_DIR", { required: false }) ||
		`tmp-${Date.now().toString()}`,
};

while (fs.existsSync(context.TMPDIR)) {
	context.TMPDIR = `tmp-${Date.now().toString()}`;
	logger.info(`TEMP_DIR already exists. Using "${context.TMPDIR}" now.`);
}

logger.info("Context:", {
	...context,
	GITHUB_TOKEN: "<secret>",
});

module.exports = context;
