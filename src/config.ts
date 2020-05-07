import * as core from "@actions/core";

export interface Config {
	GITHUB_TOKEN: string;
	FILES: string[];
	REPOSITORIES: string[];
	REPOSITORIES_LIST_REGEX: boolean;
	DRY_RUN: boolean;
	RETRIES: number;
}

export function getConfig(): Config {
	const config = {
		GITHUB_TOKEN: core.getInput("GITHUB_TOKEN", { required: true }),
		RETRIES: Number(core.getInput("RETRIES")),
		FILES: core.getInput("FILES", { required: true }).split("\n"),
		REPOSITORIES: core.getInput("REPOSITORIES", { required: true }).split("\n"),
		REPOSITORIES_LIST_REGEX: ["1", "true"].includes(
			core
				.getInput("REPOSITORIES_LIST_REGEX", { required: false })
				.toLowerCase()
		),
		DRY_RUN: ["1", "true"].includes(
			core.getInput("DRY_RUN", { required: false }).toLowerCase()
		),
	};

	if (config.DRY_RUN) {
		core.info("[DRY_RUN='true'] No changes will be written");
	}

	return config;
}
