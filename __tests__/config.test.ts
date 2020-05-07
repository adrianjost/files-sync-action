import { getConfig } from "../src/config";

function clearInputs() {
	Object.keys(process.env)
		.filter((k) => k.match(/INPUT_.*/))
		.forEach((k) => {
			process.env[k] = "";
		});
}

describe("getConfig", () => {
	const FILES = ["FOO.*", "^BAR$"];
	const REPOSITORIES = ["adrianjost/baz.*", "^adrianjost/foo$"];
	const REPOSITORIES_LIST_REGEX = true;
	const GITHUB_TOKEN = "token";
	const DRY_RUN = false;
	const RETRIES = 3;

	const inputs = {
		INPUT_GITHUB_TOKEN: GITHUB_TOKEN,
		INPUT_FILES: FILES.join("\n"),
		INPUT_REPOSITORIES: REPOSITORIES.join("\n"),
		INPUT_REPOSITORIES_LIST_REGEX: String(REPOSITORIES_LIST_REGEX),
		INPUT_DRY_RUN: String(DRY_RUN),
		INPUT_RETRIES: String(RETRIES),
	};

	beforeEach(() => {
		clearInputs();
	});

	afterAll(() => {
		clearInputs();
	});

	test("getConfig throws error on missing inputs", async () => {
		expect(() => getConfig()).toThrowError();
	});

	test("getConfig returns arrays for secrets and repositories", async () => {
		process.env = { ...process.env, ...inputs };

		expect(getConfig()).toEqual({
			GITHUB_TOKEN,
			FILES,
			REPOSITORIES,
			REPOSITORIES_LIST_REGEX,
			DRY_RUN,
			RETRIES,
		});
	});

	test("getConfig dry run should work with multiple values of true", async () => {
		process.env = { ...process.env, ...inputs };

		const cases: [string, boolean][] = [
			["0", false],
			["1", true],
			["true", true],
			["True", true],
			["TRUE", true],
			["false", false],
			["False", false],
			["FALSE", false],
			["foo", false],
			["", false],
		];

		for (let [value, expected] of cases) {
			process.env["INPUT_DRY_RUN"] = value;
			const actual = getConfig().DRY_RUN;
			expect(`${value}=${actual}`).toEqual(`${value}=${expected}`);
		}
	});
});
