const { exec } = require("child_process");
const porcelain = require("@putout/git-status-porcelain");

const {
	GITHUB_TOKEN,
	COMMIT_MESSAGE,
	GIT_USERNAME,
	GIT_EMAIL,
} = require("./context");
const { getRepoPath } = require("./utils");
const logger = require("./log");

function execCmd(command) {
	logger.info(command);
	return new Promise((resolve, reject) => {
		exec(command, function (error, stdout) {
			error ? reject(error) : resolve(stdout.trim());
		});
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

const commitAll = async (repoFullname) => {
	if (
		porcelain({
			added: true,
			deleted: true,
			modified: true,
			renamed: true,
			untracked: true,
		}).length === 0
	) {
		logger.info("NO CHANGES DETECTED");
		return;
	}
	logger.info("CHANGES DETECTED");
	logger.info("COMMIT CHANGES...");
	if (!DRY_RUN) {
		await execCmd(
			[
				`cd ${getRepoPath(repoFullname)}`,
				`git config --local user.name "${GIT_USERNAME}"`,
				`git config --local user.email "${GIT_EMAIL}"`,
				`git status`,
				// TODO: improve commit message to contain more details about the changes
				// TODO: allow customization of COMMIT_MESSAGE
				`git commit --message "${COMMIT_MESSAGE}"`,
				`git push`,
			].join(" && ")
		);
	}
	logger.info("CHANGES COMMITED");
};

module.exports = {
	clone,
	commitAll,
};
