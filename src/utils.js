import { promises as fs } from "fs";
import path from "path";

import listDir from "recursive-readdir";
import { rimraf } from "rimraf";

import {
	DRY_RUN,
	FILE_PATTERNS,
	SKIP_DELETE,
	SKIP_REPLACE,
	SRC_REPO,
	SRC_ROOT,
	TARGET_ROOT,
	TMPDIR,
} from "./context.js";
import * as log from "./log.js";

const init = (repoFullname) => {
	const getRepoSlug = () => {
		return repoFullname.split(":")[0];
	};

	const getRepoBranch = () => {
		return repoFullname.split(":")[1] || undefined;
	};

	const getRepoPath = () => {
		return path.join(
			TMPDIR,
			`${getRepoSlug()}${
				getRepoBranch() === undefined ? "" : `-${getRepoBranch()}`
			}`
		);
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
		log.info(
			"FILE_PATTERNS",
			FILE_PATTERNS.map((a) => a.toString())
		);
		return files.filter((file) => {
			const cleanFile = getPrettyPath(file);
			const hasMatch = FILE_PATTERNS.some((r) => r.test(cleanFile));
			return hasMatch;
		});
	};

	const getFiles = async () => {
		const files = await listDir(getRepoPath(), [".git"]);
		log.debug("FILES:", JSON.stringify(files.map(getPrettyPath), undefined, 2));
		const matchingFiles = getMatchingFiles(files);
		log.info(
			"MATCHING FILES:",
			JSON.stringify(matchingFiles.map(getPrettyPath), undefined, 2)
		);
		return matchingFiles;
	};

	const copyFile = async (from, to) => {
		const targetExists = await fs
			.access(to)
			.then(() => true)
			.catch(() => false);
		if (SKIP_REPLACE && targetExists) {
			log.info(
				"skip copying",
				from.replace(/\\/g, "/").replace(/^\//, ""),
				"to",
				to.replace(/\\/g, "/").replace(/^\//, ""),
				"because SKIP_REPLACE = true"
			);
			return;
		}
		log.info(
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
			log.info(
				"SKIP REMOVING FILES because `SKIP_DELETE` is set to `true`",
				filePaths.map((f) => `"${f}"`).join(", ")
			);
			return;
		}
		log.info("REMOVE FILES", filePaths);
		if (DRY_RUN) {
			return;
		}
		return Promise.all(filePaths.map((file) => fs.unlink(file)));
	};

	return {
		copyFile,
		getFiles,
		getRepoBranch,
		getRepoFilePath,
		getRepoPath,
		getRepoRelativeFilePath,
		getRepoSlug,
		removeFiles,
	};
};

const removeDir = async (dir) => {
	await rimraf(dir, { glob: false });
};

export { init, removeDir };
