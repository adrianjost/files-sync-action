const { exec } = require("child_process");
const { parse: porcelainParse } = require("@putout/git-status-porcelain");

const {
	GITHUB_TOKEN,
	COMMIT_MESSAGE,
	GIT_USERNAME,
	GIT_EMAIL,
	DRY_RUN,
} = require("./context");
const { getRepoPath } = require("./utils");
const logger = require("./log");

function execCmd(command, workingDir) {
	logger.info("EXEC", command);
	return new Promise((resolve, reject) => {
		exec(
			command,
			{
				cwd: workingDir,
			},
			function (error, stdout) {
				logger.info(command, "OUTPUT", error, stdout);
				error ? reject(error) : resolve(stdout.trim());
			}
		);
	});
}

const clone = async (repoFullname) => {
	// TODO: allow customizing the branch
	return execCmd(
		`git clone --depth 1 https://${GITHUB_TOKEN}@github.com/${repoFullname}.git ${getRepoPath(
			repoFullname
		)}`
	);
};

const hasChanges = async (repoFullname) => {
	const statusOutput = await execCmd(
		`git status --porcelain`,
		getRepoPath(repoFullname)
	);
	return porcelainParse(statusOutput).length !== 0;
};

const commitAll = async (repoFullname) => {
	if (!(await hasChanges(repoFullname))) {
		logger.info("NO CHANGES DETECTED");
		return;
	}
	logger.info("CHANGES DETECTED");
	logger.info("COMMIT CHANGES...");
	if (!DRY_RUN) {
		await execCmd(
			[
				`git config --local user.name "${GIT_USERNAME}"`,
				`git config --local user.email "${GIT_EMAIL}"`,
				// TODO: improve commit message to contain more details about the changes
				// TODO: allow customization of COMMIT_MESSAGE
				`git add -A`,
				`git status`,
				`git commit --message "${COMMIT_MESSAGE}"`,
				`git push`,
			].join(" && "),
			getRepoPath(repoFullname)
		);
	}
	logger.info("CHANGES COMMITED");
};

module.exports = {
	clone,
	commitAll,
};
