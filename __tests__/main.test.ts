import * as config from "../src/config";
import * as github from "../src/github";
import * as secrets from "../src/files";

// @ts-ignore-next-line
import fixture from "@octokit/fixtures/scenarios/api.github.com/get-repository/normalized-fixture.json";
import nock from "nock";
import { run } from "../src/main";

nock.disableNetConnect();

beforeEach(() => {});

test("run should succeed with a repo and secret", async () => {
	(github.listAllMatchingRepos as jest.Mock) = jest
		.fn()
		.mockImplementation(async () => [fixture[0].response]);

	(github.setSecretForRepo as jest.Mock) = jest
		.fn()
		.mockImplementation(async () => null);

	(secrets.getFiles as jest.Mock) = jest.fn().mockReturnValue({
		BAZ: "bar",
	});

	(config.getConfig as jest.Mock) = jest.fn().mockReturnValue({
		GITHUB_TOKEN: "token",
		FILES: ["BAZ"],
		REPOSITORIES: [".*"],
		REPOSITORIES_LIST_REGEX: true,
		DRY_RUN: false,
		RETRIES: 3,
	});
	await run();

	expect(github.listAllMatchingRepos as jest.Mock).toBeCalledTimes(1);
	expect((github.setSecretForRepo as jest.Mock).mock.calls[0][3]).toEqual(
		fixture[0].response
	);

	expect(process.exitCode).toBe(undefined);
});

test("run should succeed with a repo and secret with repository_list_regex as false", async () => {
	(github.setSecretForRepo as jest.Mock) = jest
		.fn()
		.mockImplementation(async () => null);

	(secrets.getFiles as jest.Mock) = jest.fn().mockReturnValue(["/LICENSE.md"]);

	(config.getConfig as jest.Mock) = jest.fn().mockReturnValue({
		GITHUB_TOKEN: "token",
		FILES: ["BAZ"],
		REPOSITORIES: [fixture[0].response.full_name],
		REPOSITORIES_LIST_REGEX: false,
		DRY_RUN: false,
	});
	await run();

	expect((github.setSecretForRepo as jest.Mock).mock.calls[0][3]).toEqual({
		full_name: fixture[0].response.full_name,
	});

	expect(process.exitCode).toBe(undefined);
});
