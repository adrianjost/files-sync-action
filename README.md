# Files Sync Action

[![Build](https://github.com/adrianjost/files-sync-action/workflows/Build/badge.svg)](https://github.com/adrianjost/files-sync-action/actions?query=workflow%3ABuild) [![Release](https://github.com/adrianjost/files-sync-action/workflows/Release/badge.svg)](https://github.com/adrianjost/files-sync-action/actions?query=workflow%3ARelease) [![Dependency Status](https://david-dm.org/adrianjost/files-sync-action.svg)](https://david-dm.org/adrianjost/files-sync-action) [![Dependency Status](https://david-dm.org/adrianjost/files-sync-action/dev-status.svg)](https://david-dm.org/adrianjost/files-sync-action?type=dev) ![GitHub contributors](https://img.shields.io/github/contributors/adrianjost/files-sync-action?color=bright-green)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=adrianjost/files-sync-action)](https://dependabot.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Github Action that can sync files from one repository to many others. This action allows a maintainer to define community health files in a single repository and have them synced to all other repositories in the Github organization or beyond. You could sync common GitHub Action Workflows, your LICENSE or any other file you can imagine. Regex is used to select the files. Exclude is currently not supported and it is recommended to use a bot user if possible.

## Inputs

### `GITHUB_TOKEN`

**Required** Token to use to get repos and write secrets. `${{secrets.GITHUB_TOKEN}}` will **not** work.

### `GITHUB_SERVER`

Configurable GitHub Server (to support GitHub Enterprise deployments).  If not specified, will default to `github.com`. Should not include `http(s)://`.  Should also not include trailing `/` character.

### `SRC_REPO`

Source of truth for all files to sync. If files get added, modified or deleted here, those changes will be synced to all TARGET_REPOS. Defaults to the workflows repository (`$GITHUB_REPOSITORY`). A custom branch can be defined by adding the branchname after a colon behind the SRC_REPO. `repoSlug` or `repoSlug:branchName`

### `TARGET_REPOS`

**Required** New line deliminated list of repositories. Repositories are limited to those in which the token user is an owner or collaborator. A custom branch can be defined for each repo by adding the branchname after a colon behind the repoSlug. `repoSlug` or `repoSlug:branchName`. The custom branch must already exist in the target repo.

### `FILE_PATTERNS`

**Required** New line deliminated regex expressions to select files from the source repository. All matching files in the target repository will be

1. deleted if not present in the `SRC_REPO`, and `SKIP_DELETE` is `false`
2. overwritten from the `SRC_REPO` if they already exist in the `TARGET_REPO`
3. created in the `TARGET_REPO`, if they do not exist yet there.

All filepaths start at the repository root without a leading slash. The delimiter between path segments is always a forward slash.

### `SRC_ROOT`

Prepends this to all filepaths in the source repository. Defaults to `/`.

### `TARGET_ROOT`

Prepends this to all filepaths in the target repository. It is the same for all target repositories and cannot be adjusted on a per repo basis. Defaults to `/`.

### `COMMIT_MESSAGE`

The commit message that will be used to commit the changed files. Check the README for all interpolation options. You can interpolate values by using placeholders in the form of `%KEY%` where key can be one of the following items:

| key           | description                                |
| ------------- | ------------------------------------------ |
| `SRC_REPO`    | The value from the according action input. |
| `TARGET_REPO` | The current repo to commit into            |

You need more? Let me know by [opening an issue here](https://github.com/adrianjost/files-sync-action/issues/new). I will do my best to add them.

### `SKIP_DELETE`

Will omit all delete operations for matching files present in `TARGET_REPO` but not existant in `SRC_REPO` if set to `true`. Defaults to `false`.

### `SKIP_REPLACE`

Will omit all write operations for matching files present in `SRC_REPO` and `TARGET_REPO` if set to `true`. Defaults to `false`.

### `TEMP_DIR`

The working directory where all sync operations will be done. Defaults to `tmp-${Date.now().toString()}`

### `SKIP_CLEANUP`

If set to `true` or `1`, the cleanup step to remove the temporary workding directory at the end will be skipped. Usefull for debugging purposes. Defaults to `false`.

### `GIT_EMAIL`

The e-mail address used to commit the synced files. Defaults to `${process.env.GITHUB_ACTOR}@users.noreply.github.com`.

### `GIT_USERNAME`

The username used to commit the synced files. Defaults to `process.env.GITHUB_ACTOR`.

### `DRY_RUN`

Run everything except for secret create and update functionality. Defaults to `false`.

## Usage

```yaml
uses: adrianjost/files-sync-action@v1.0.1
  with:
    FILE_PATTERNS: |
      ^LICENSE$
      ^.github/workflows/sync-.*
    TARGET_REPOS: |
      adrianjost/files-sync-target
      any/other-repo:customBranch
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_FILES }}
```

See the workflows in [this repository](https://github.com/adrianjost/.github) for another example.

## Planned Features

- [ ] allow RegExp for repo selection just like in [google/secrets-sync-action](https://github.com/google/secrets-sync-action) allows it.

## Local Testing

Create `./test.js` with the following content to execute the code locally.

```
process.env.INPUT_SRC_REPO = "adrianjost/files-sync-action";
process.env.INPUT_TARGET_REPOS = "adrianjost/files-sync-target";
process.env.INPUT_GITHUB_TOKEN = "YOUR_GITHUB_TOKEN";
process.env.INPUT_FILE_PATTERNS = "^README.md$";
process.env.INPUT_SKIP_CLEANUP = "false";
process.env.GITHUB_ACTOR = "adrianjost";
process.env.INPUT_DRY_RUN = "true";

require("./index");
```
