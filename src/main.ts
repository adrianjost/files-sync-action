import * as core from "@actions/core";
import {
	DefaultOctokit,
	Repository,
	listAllMatchingRepos,
	setFilesForRepo,
} from "./github";
import { getConfig } from "./config";
import { getFiles } from "./files";

export async function run(): Promise<void> {
	try {
		const config = getConfig();
		const files = getFiles(config.FILES);

		if (!files) {
			core.setFailed(`Files: no matches with "${config.FILES.join(", ")}"`);
			return;
		}

		const octokit = DefaultOctokit({
			auth: config.GITHUB_TOKEN,
		});

		let repos: Repository[];
		if (config.REPOSITORIES_LIST_REGEX) {
			repos = await listAllMatchingRepos({
				patterns: config.REPOSITORIES,
				octokit,
			});
		} else {
			repos = config.REPOSITORIES.map((s) => {
				return {
					full_name: s,
				};
			});
		}

		if (repos.length === 0) {
			const repoPatternString = config.REPOSITORIES.join(", ");
			core.setFailed(
				`Repos: No matches with "${repoPatternString}". Check your token and regex.`
			);
			return;
		}

		const repoNames = repos.map((r) => r.full_name);

		core.info(
			JSON.stringify(
				{
					REPOSITORIES: config.REPOSITORIES,
					REPOSITORIES_LIST_REGEX: config.REPOSITORIES_LIST_REGEX,
					FILES: config.FILES,
					DRY_RUN: config.DRY_RUN,
					FOUND_REPOS: repoNames,
					FOUND_FILES: files,
				},
				null,
				2
			)
		);

		const calls = repos.map(async (repo) =>
			setFilesForRepo(octokit, files, repo, config.DRY_RUN)
		);
		await Promise.all(calls);
	} catch (error) {
		core.error(error);

		core.setFailed(error.message);
	}
}
