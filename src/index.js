const path = require("path");

const { SRC_REPO, TARGET_REPOS, TMPDIR, SKIP_CLEANUP } = require("./context");
const git = require("./git");
const { removeDir } = require("./utils");

const getLogger = require("./log");
const showLogs = getLogger().print;
const utils = require("./utils");

const main = async () => {
	let error;
	try {
		// PREPARE SRC
		const gitSrc = git.init(SRC_REPO);
		const utilsSrc = utils.init(SRC_REPO);

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
				const utilsRepo = utils.init(repo);
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
					...srcFiles.map(async (srcFile) =>
						utilsRepo.copyFile(
							srcFile,
							path.join(
								utilsRepo.getRepoFilePath(),
								utilsSrc.getRepoRelativeFilePath(srcFile)
							)
						)
					),
				]);

				// REFRESH INDEX
				await gitRepo.refreshIndex();

				// COMMIT UPDATES
				await gitRepo.commitAll();

				showLogs(repo);
			})
		);
	} catch (err) {
		error = err;
	}

	// Output all Logs
	showLogs();

	if (!SKIP_CLEANUP) {
		await removeDir(TMPDIR);
	}
	if (error) {
		throw error;
	}
};

module.exports = main;
