const fs = require("fs");
const path = require("path");
const listDir = require("recursive-readdir");
const rimraf = require("rimraf");

const { TMPDIR, FILE_PATTERNS, DRY_RUN, SKIP_DELETE } = require("./context");
const logger = require("./log");

const getRepoPath = (repoFullname) => {
	return path.join(TMPDIR, repoFullname);
};

const getRepoRelativeFilePath = (repoFullname, filePath) => {
	return path.relative(getRepoPath(repoFullname), filePath);
};

const getMatchingFiles = (repoFullname, files) => {
	logger.info(
		"FILE_PATTERNS",
		FILE_PATTERNS.map((a) => a.toString())
	);
	return files.filter((file) => {
		cleanFile = file
			.replace(/\\/g, "/")
			.replace(/^\//, "")
			.replace(new RegExp(`^${TMPDIR}/${repoFullname}/`), "");
		const hasMatch = FILE_PATTERNS.some((r) => r.test(cleanFile));
		logger.info("TEST", cleanFile, "FOR MATCH =>", hasMatch);
		return hasMatch;
	});
};

const getFiles = async (repoFullname) => {
	// TODO [$5eb6b95ae4315b0007b33cd5]: evaluate if ignoring .git is a good idea
	const files = await listDir(getRepoPath(repoFullname), [".git"]);
	logger.info("FILES:", JSON.stringify(files, undefined, 2));
	const matchingFiles = getMatchingFiles(repoFullname, files);
	logger.info("MATCHING FILES:", JSON.stringify(matchingFiles, undefined, 2));
	return matchingFiles;
};

const removeFiles = async (filePaths) => {
	if (SKIP_DELETE) {
		logger.info(
			"SKIP REMOVING FILES because `SKIP_DELETE` is set to `true`",
			filePaths
		);
	}
	logger.info("REMOVE FILES", filePaths);
	if (DRY_RUN) {
		return;
	}
	return Promise.all(filePaths.map((file) => fs.promises.unlink(file)));
};

const copyFile = async (from, to) => {
	// TODO [$5eb6b95ae4315b0007b33cd6]: add option to skip replacement of files
	logger.info("copy", from, "to", to);
	if (DRY_RUN) {
		return;
	}
	await fs.promises.mkdir(path.dirname(to), { recursive: true });
	await fs.promises.copyFile(from, to);
};

const removeDir = async (dir) => {
	new Promise((resolve, reject) => {
		rimraf(
			dir,
			{
				disableGlob: true,
			},
			(error) => {
				if (error) {
					return reject(error);
				}
				resolve();
			}
		);
	});
};

module.exports = {
	copyFile,
	getFiles,
	getRepoPath,
	getRepoRelativeFilePath,
	removeDir,
	removeFiles,
};
