const { exec } = require("child_process");
const porcelain = require("@putout/git-status-porcelain");

const {
	GIT_PERSONAL_TOKEN,
	COMMIT_MESSAGE,
	GIT_USERNAME,
	GIT_EMAIL,
} = require("./context");
const { getRepoPath } = require("./utils");

function execCmd(command) {
	console.log(command);
	return new Promise((resolve, reject) => {
		exec(command, function (error, stdout) {
			error ? reject(error) : resolve(stdout.trim());
		});
	});
}

const clone = async (repoFullname) => {
	// TODO: allow customizing the branch
	return execCmd(
		`git clone --depth 1 https://${GIT_PERSONAL_TOKEN}@github.com/${repoFullname}.git ${getRepoPath(
			repoFullname
		)}`
	);
};

const commitAll = async (repoFullname) => {
	if (porcelain().length === 0) {
		console.log("NO CHANGES DETECTED");
		return;
	}
	console.log("CHANGES DETECTED");
	console.log("COMMIT CHANGES...");
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
	console.log("CHANGES COMMITED");
};

module.exports = {
	clone,
	commitAll,
};
