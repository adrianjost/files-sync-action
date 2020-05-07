# Secrets Sync Action

![Build](https://github.com/adrianjost/files-sync-action/workflows/Build/badge.svg) ![Release](https://github.com/adrianjost/files-sync-action/workflows/Release/badge.svg) [![codecov](https://codecov.io/gh/adrianjost/files-sync-action/branch/master/graph/badge.svg)](https://codecov.io/gh/adrianjost/files-sync-action) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Github Action that can sync files from one repository to many others. This action allows a maintainer to define community health files in a single repository and have them synced to all other repositories in the Github organization or beyond. You could sync common GitHub Action Workflows, your LICENSE or any other file you can imagine. Regex is used to select the files and the repositories. Exclude is currently not supported and it is recommended to use a bot user if possible.

## Inputs

### `github_token`

**Required** Token to use to get repos and write secrets. `${{secrets.GITHUB_TOKEN}}` will **not** work.

### `repositories`

**Required** New line deliminated regex expressions to select repositories. Repositires are limited to those in whcich the token user is an owner or collaborator. Set `repositories_list_regex` to `False` to use a hardcoded list of repositories.

### `repositories_list_regex`

If this value is `true` (default), the action will find all repositories available to the token user and filter based upon the regex provided. If it is false, it is expected that `repositories` will be an a new line deliminated list in the form of org/name.

### `secrets`

**Required** New line deliminated regex expressions to select values from `process.env`. Use the action env to pass secrets from the repository in which this action runs with the `env` attribute of the step.

### `retries`

The number of retries to attempt when making Github calls when triggering rate limits or abuse limits. Defaults to 3.

### `dry_run`

Run everything except for secret create and update functionality.

## Usage

```yaml
uses: adrianjost/files-sync-action
  with:
    FILES: |
      ^FOO$
      ^GITHUB_.*
    REPOSITORIES: |
      ${{github.repository}}
    DRY_RUN: true
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_FILES }}
  env:
    FOO: ${{github.run_id}}
    FOOBAR: BAZ
```

See the workflows in this repository for another example.
