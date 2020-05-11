const path = require("path");

const { SRC_REPO, TARGET_REPOS, TMPDIR, SKIP_CLEANUP } = require("./context");
const git = require("./git");
const { removeDir } = require("./utils");

const showLogs = require("./log")().print;

const main = async () => {
	let error;
	try {
		// PREPARE SRC
		const gitSrc = git.init(SRC_REPO);
		const utilsSrc = require("./utils").init(SRC_REPO);

		await gitSrc.clone();
		const srcFiles = await utilsSrc.getFiles();
		const relativeSrcFiles = srcFiles.map((file) =>
			utilsSrc.getRepoRelativeFilePath(file)
		);
		showLogs(SRC_REPO);

		await new Promise((resolve) => setTimeout(resolve, 5000));

		// EXEC IN TARGET REPOS
		await Promise.all(
			TARGET_REPOS.map(async (repo) => {
				const utilsRepo = require("./utils").init(repo);
				const gitRepo = git.init(repo);

				// PREPARE TARGET
				await gitRepo.clone();
				const targetFiles = await utilsRepo.getFiles();
				const removedFiles = targetFiles.filter(
					(file) =>
						!relativeSrcFiles.includes(utilsRepo.getRepoRelativeFilePath(file))
				);

				// UPDATE FILES
				await Promise.all([
					utilsRepo.removeFiles(removedFiles),
					srcFiles.map(async (srcFile) =>
						utilsRepo.copyFile(
							srcFile,
							path.join(
								utilsRepo.getRepoPath(),
								utilsSrc.getRepoRelativeFilePath(srcFile)
							)
						)
					),
				]);

				// COMMIT UPDATES
				await gitRepo.commitAll();

				showLogs(repo);
			})
		);
	} catch (err) {
		error = err;
	}

	// Output all Logs
	require("./log")().print();

	if (!SKIP_CLEANUP) {
		await removeDir(TMPDIR);
	}
	if (error) {
		throw error;
	}
};

module.exports = main;
