const path = require("path");

const { SRC_REPO, TARGET_REPOS, TMPDIR, SKIP_CLEANUP } = require("./context");
const git = require("./git");
const {
	getFiles,
	getRepoPath,
	getRepoRelativeFilePath,
	removeFiles,
	copyFile,
	removeDir,
} = require("./utils");

const main = async () => {
	let error;
	try {
		// PREPARE SRC
		await git.clone(SRC_REPO);
		const srcFiles = await getFiles(SRC_REPO);
		const relativeSrcFiles = srcFiles.map((file) =>
			getRepoRelativeFilePath(SRC_REPO, file)
		);

		// EXEC IN TARGET REPOS
		await Promise.all(
			TARGET_REPOS.map(async (repo) => {
				// PREPARE TARGET
				await git.clone(repo);
				const targetFiles = await getFiles(repo);
				const removedFiles = targetFiles.filter(
					(file) =>
						!relativeSrcFiles.includes(getRepoRelativeFilePath(repo, file))
				);

				// UPDATE FILES
				await Promise.all([
					removeFiles(removedFiles),
					srcFiles.map(async (srcFile) =>
						copyFile(
							srcFile,
							path.join(
								getRepoPath(repo),
								getRepoRelativeFilePath(SRC_REPO, srcFile)
							)
						)
					),
				]);

				// COMMIT UPDATES
				await git.commitAll(repo);
			})
		);
	} catch (err) {
		error = err;
	}
	if (!SKIP_CLEANUP) {
		await removeDir(TMPDIR);
	}
	if (error) {
		throw error;
	}
};

module.exports = main;
