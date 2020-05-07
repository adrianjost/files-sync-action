import * as core from "@actions/core";
import * as glob from "glob";

/**
 * Filter the given filepaths using patterns regexp's.
 * @param files
 * @param patterns
 */
export function getMatchingFiles(
	files: string[],
	patterns: string[]
): string[] {
	const regexPatterns = patterns.map((s) => new RegExp(s));
	console.log(regexPatterns);
	return files.filter((file: string) => {
		return regexPatterns.some((r) => r.test(file));
	});
}

/**
 * Get matching files from current working directory using patterns to match filepaths.
 * @param patterns
 */
export function getFiles(patterns: string[]): string[] {
	const files = glob.sync("**");
	core.debug(`Available files: ${files.length}`);
	return getMatchingFiles(files, patterns);
}
