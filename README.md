# Files Sync Action

![Build](https://github.com/adrianjost/files-sync-action/workflows/Build/badge.svg) ![Release](https://github.com/adrianjost/files-sync-action/workflows/Release/badge.svg) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Github Action that can sync files from one repository to many others. This action allows a maintainer to define community health files in a single repository and have them synced to all other repositories in the Github organization or beyond. You could sync common GitHub Action Workflows, your LICENSE or any other file you can imagine. Regex is used to select the files. Exclude is currently not supported and it is recommended to use a bot user if possible.

## Inputs

### `GITHUB_TOKEN`

**Required** Token to use to get repos and write secrets. `${{secrets.GITHUB_TOKEN}}` will **not** work.

### `SRC_REPO`

Source of truth for all files to sync. If files get added, modified or deleted here, those changes will be synced to all TARGET_REPOS. Defaults to the workflows repository (`$GITHUB_REPOSITORY`)

### `TARGET_REPOS`

**Required** New line deliminated list of repositories. Repositires are limited to those in which the token user is an owner or collaborator.

### `FILE_PATTERNS`

**Required** New line deliminated regex expressions to select files from the source repository. All matching files in the target repository will be

1. deleted if not present in the `SRC_REPO`, and `SKIP_DELETE` is `false`
2. overwritten from the `SRC_REPO` if they already exist in the `TARGET_REPO`
3. created in the `TARGET_REPO`, if they do not exist yet there.

All filpaths start at the repository root without a leading slash. The delimiter between path segments is always a forward slash.

### `SKIP_DELETE`

Will omit all delete operations for matching files present in `TARGET_REPO` but not existant in `SRC_REPO` if set to `true`. Defaults to `false`.

### `TEMP_DIR`

The working directory where all sync operations will be done. Defaults to `tmp-${Date.now().toString()}`

### `SKIP_CLEANUP`

If set to true or 1, the cleanup step to remove the temporary workding directory at the end will be skipped. Usefull for debugging purposes. Defaults to `false`.

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
      any/other-repo
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_FILES }}
```

See the workflows in [this repository](https://github.com/adrianjost/.github) for another example.

## Planned Features

- [ ] allow RegExp for repo selection just like in [google/secrets-sync-action](https://github.com/google/secrets-sync-action) allows it.
- [ ] add option to skip replacement of files
