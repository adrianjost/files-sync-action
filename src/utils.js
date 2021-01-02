const fs = require("fs").promises;
const path = require("path");
const listDir = require("recursive-readdir");
const rimraf = require("rimraf");

const {
	TMPDIR,
	FILE_PATTERNS,
	DRY_RUN,
	SKIP_DELETE,
	SRC_REPO,
	SRC_ROOT,
	TARGET_ROOT,
} = require("./context");

const init = (repoFullname) => {
	const logger = require("./log")(repoFullname);

	const getRepoPath = () => {
		return path.join(TMPDIR, repoFullname);
	};

	const getRepoRoot = () =>
		repoFullname === SRC_REPO ? SRC_ROOT : TARGET_ROOT;

	const getRepoFilePath = () => path.join(getRepoPath(), getRepoRoot());

	const getRepoRelativeFilePath = (filePath) => {
		return path.relative(getRepoFilePath(), filePath);
	};

	const getPrettyPath = (file) =>
		file
			.replace(/\\/g, "/")
			.replace(/^\//, "")
			.replace(new RegExp(`^${TMPDIR}/${repoFullname}${getRepoRoot()}`), "");

	const getMatchingFiles = (files) => {
		logger.info(
			"FILE_PATTERNS",
			FILE_PATTERNS.map((a) => a.toString())
		);
		return files.filter((file) => {
			cleanFile = getPrettyPath(file);
			const hasMatch = FILE_PATTERNS.some((r) => r.test(cleanFile));
			return hasMatch;
		});
	};

	const getFiles = async () => {
		// TODO [#19]: evaluate if ignoring .git is a good idea
		const files = await listDir(getRepoPath(), [".git"]);
		logger.debug(
			"FILES:",
			JSON.stringify(files.map(getPrettyPath), undefined, 2)
		);
		const matchingFiles = getMatchingFiles(files);
		logger.info(
			"MATCHING FILES:",
			JSON.stringify(matchingFiles.map(getPrettyPath), undefined, 2)
		);
		return matchingFiles;
	};

	const copyFile = async (from, to) => {
		// TODO [#20]: add option to skip replacement of files
		logger.info(
			"copy",
			from.replace(/\\/g, "/").replace(/^\//, ""),
			"to",
			to.replace(/\\/g, "/").replace(/^\//, "")
		);
		if (DRY_RUN) {
			return;
		}
		await fs.mkdir(path.dirname(to), { recursive: true });
		await fs.copyFile(from, to);
	};

	const removeFiles = async (filePaths) => {
		if (SKIP_DELETE) {
			logger.info(
				"SKIP REMOVING FILES because `SKIP_DELETE` is set to `true`",
				filePaths.map((f) => `"${f}"`).join(", ")
			);
		}
		logger.info("REMOVE FILES", filePaths);
		if (DRY_RUN) {
			return;
		}
		return Promise.all(filePaths.map((file) => fs.unlink(file)));
	};

	return {
		copyFile,
		getFiles,
		getRepoPath,
		getRepoFilePath,
		getRepoRelativeFilePath,
		removeFiles,
	};
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
	init,
	removeDir,
};
