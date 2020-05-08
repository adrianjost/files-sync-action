const fs = require("fs");
const path = require("path");
const listDir = require("recursive-readdir");
const rimraf = require("rimraf");

const { TMPDIR, FILE_PATTERNS } = require("./context");

const getRepoPath = (repoFullname) => {
	return path.join(TMPDIR, repoFullname);
};

const getRepoRelativeFilePath = (repoFullname, filePath) => {
	return path.relative(getRepoPath(repoFullname), filePath);
};

const getMatchingFiles = (files) => {
	console.log(FILE_PATTERNS);
	return files.filter((file) => {
		// TODO: document behaviour that all filepaths can be matched using a single fwd slash
		cleanFile = file.replace(TMPDIR, "").replace(/\\/g, "/").replace(/^\//, "");
		const hasMatch = FILE_PATTERNS.some((r) => r.test(cleanFile));
		console.log("TEST", cleanFile, "FOR MATCH =>", hasMatch);
		return hasMatch;
	});
};

const getFiles = async (repoFullname) => {
	// TODO: evaluate if ignoring .git is a good idea
	const files = await listDir(getRepoPath(repoFullname), [".git"]);
	console.log("FILES:", JSON.stringify(files, undefined, 2));
	const matchingFiles = getMatchingFiles(files);
	console.log("MATCHING FILES:", JSON.stringify(matchingFiles, undefined, 2));
	return matchingFiles;
};

const removeFiles = async (filePaths) => {
	console.log("REMOVE FILES", filePaths);
	// TODO: implement DRY_RUN for removeFiles
	return Promise.all(filePaths.map((file) => fs.promises.unlink(file)));
};

const copyFile = async (from, to) => {
	// TODO: implement DRY_RUN for copyFile
	console.log("copy", from, "to", to);
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
	removeFiles,
	removeDir,
};
