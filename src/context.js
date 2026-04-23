import fs from "fs";

import * as core from "@actions/core";

import * as log from "./log.js";

const parseMultilineInput = (multilineInput) => {
	return multilineInput.split("\n").map((e) => e.trim());
};

export const COMMIT_MESSAGE =
	core.getInput("COMMIT_MESSAGE", { required: false }) ||
	`Update file(s) from \"%SRC_REPO%\"`;
export const DRY_RUN = ["1", "true"].includes(
	core.getInput("DRY_RUN", { required: false }).toLowerCase()
);
export const FILE_PATTERNS = parseMultilineInput(
	core.getInput("FILE_PATTERNS")
).map((s) => new RegExp(s));
export const GITHUB_SERVER =
	core.getInput("GITHUB_SERVER", { required: false }) || "github.com";
export const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN", { required: true });
export const GIT_EMAIL =
	core.getInput("GIT_EMAIL") ||
	`${process.env.GITHUB_ACTOR}@users.noreply.github.com`;
export const GIT_USERNAME =
	core.getInput("GIT_USERNAME", { required: false }) ||
	process.env.GITHUB_ACTOR;
export const SKIP_CLEANUP = ["1", "true"].includes(
	core.getInput("SKIP_CLEANUP", { required: false }).toLowerCase()
);
export const SKIP_DELETE = ["1", "true"].includes(
	core.getInput("SKIP_DELETE", { required: false }).toLowerCase()
);
export const SKIP_REPLACE = ["1", "true"].includes(
	core.getInput("SKIP_REPLACE", { required: false }).toLowerCase()
);
export const SRC_REPO =
	core.getInput("SRC_REPO", { required: false }) ||
	process.env.GITHUB_REPOSITORY;
export const SRC_ROOT = core.getInput("SRC_ROOT", { required: false }) || "/";
export const TARGET_REPOS = parseMultilineInput(
	core.getInput("TARGET_REPOS", { required: true })
);
export const TARGET_ROOT =
	core.getInput("TARGET_ROOT", { required: false }) || "/";
export let TMPDIR =
	core.getInput("TEMP_DIR", { required: false }) ||
	`tmp-${Date.now().toString()}`;

while (fs.existsSync(TMPDIR)) {
	TMPDIR = `tmp-${Date.now().toString()}`;
	log.info(`TEMP_DIR already exists. Using "${TMPDIR}" now.`);
}

log.info("Context:", {
	COMMIT_MESSAGE,
	DRY_RUN,
	FILE_PATTERNS,
	GITHUB_SERVER,
	GITHUB_TOKEN: "<secret>",
	GIT_EMAIL,
	GIT_USERNAME,
	SKIP_CLEANUP,
	SKIP_DELETE,
	SKIP_REPLACE,
	SRC_REPO,
	SRC_ROOT,
	TARGET_REPOS,
	TARGET_ROOT,
	TMPDIR,
});
