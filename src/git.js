const { exec } = require("child_process");
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
	// TODO: make sure there are no changes in the current repo after cloning
	return execCmd(
		`git clone --depth 1 https://${GIT_PERSONAL_TOKEN}@github.com/${repoFullname}.git ${getRepoPath(
			repoFullname
		)}`
	);
};

const commitAll = async (repoFullname) => {
	return execCmd(
		[
			`cd ${getRepoPath(repoFullname)}`,
			`git config --local user.name "${GIT_USERNAME}"`,
			`git config --local user.email "${GIT_EMAIL}"`,
			`git add -A`,
			`git status`,
			// TODO: improve commit message to contain more details about the changes
			// TODO: allow customization of COMMIT_MESSAGE
			`git commit --message "${COMMIT_MESSAGE}"`,
			`git push`,
		].join(" && ")
	);
};

module.exports = {
	clone,
	commitAll,
};
