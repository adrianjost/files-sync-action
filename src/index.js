import path from "path";

import { SKIP_CLEANUP, SRC_REPO, TARGET_REPOS, TMPDIR } from "./context.js";
import * as git from "./git.js";
import * as log from "./log.js";
import { removeDir } from "./utils.js";
import * as utils from "./utils.js";

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

		// EXEC IN TARGET REPOS
		for (const repo of TARGET_REPOS) {
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

			// COMMIT UPDATES
			await gitRepo.commitAll();
		}
	} catch (err) {
		log.error("ERROR:", err);
		error = err;
	}

	if (!SKIP_CLEANUP) {
		await removeDir(TMPDIR);
	}
	if (error) {
		throw error;
	}
};

export default main;
