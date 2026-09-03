---
title: Install artef
description: Learn how to install artef using npm, npx, or Homebrew. Set up artef for command-line usage or as a library in your project.
keywords: [install, installation, npm, npx, homebrew, windows, setup, artef]
sidebar_position: 4
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

Install artef using [npm](https://nodejs.org/en/download), [npx](https://nodejs.org/en/download), or [Homebrew](https://brew.sh) (Mac, Linux):

<Tabs groupId="artef-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    npm install -g artef
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx artef@latest
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    brew install artef
    ```
  </TabItem>
</Tabs>

:::note
npm and npx require [Node.js](https://nodejs.org/en/download) `>=22.22.0`.
:::

## Node.js runtime support

artef requires Node.js `22.22.0` or newer. Node.js 24 LTS is recommended.

If you are on an older release, upgrade Node.js before installing or updating artef.

<Tabs groupId="node-version-manager">
  <TabItem value="nvm" label="nvm" default>
    ```bash
    nvm install 24
    nvm use 24
    ```
  </TabItem>
  <TabItem value="fnm" label="fnm">
    ```bash
    fnm install 24
    fnm use 24
    ```
  </TabItem>
  <TabItem value="volta" label="Volta">
    ```bash
    volta install node@24
    ```
  </TabItem>
  <TabItem value="other" label="Other">
    Download a current LTS release from the [Node.js download page](https://nodejs.org/en/download).
  </TabItem>
</Tabs>

For CI, set the configured Node.js version to `24`. For a custom Docker image, use a current
Node.js base image such as `node:24`. After switching runtimes, verify the active version with
`node --version`, then install or update artef.

To use artef as a library in your project, run `npm install artef --save`.

## Verify Installation

To verify that artef is installed correctly, run:

<Tabs groupId="artef-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    artef --version
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx artef@latest --version
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    artef --version
    ```
  </TabItem>
</Tabs>

This should display the current version number of artef.

## Run artef

After installation, you can start using artef by running:

<Tabs groupId="artef-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    artef init
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx artef@latest init
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    artef init
    ```
  </TabItem>
</Tabs>

This will guide you through the process of creating a `artefconfig.yaml` file.

For a guide on running your first evaluation, please refer to our [Getting Started guide](./getting-started.md).

## Uninstall artef

### Remove the package

If you installed artef with more than one method (for example, both npm and Homebrew), repeat the relevant steps for each.

<Tabs groupId="artef-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    npm uninstall -g artef
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    `npx` does not install artef permanently — no uninstall step is needed. If you also have a global install (via npm or Homebrew), remove it using the corresponding tab.
</TabItem>
  <TabItem value="brew" label="brew (Mac, Linux)">
    ```bash
    brew uninstall artef
    ```
  </TabItem>
</Tabs>

If you installed artef as a project dependency, remove it from your project:

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>
    ```bash
    npm uninstall artef
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn remove artef
    ```
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
    ```bash
    pnpm remove artef
    ```
  </TabItem>
</Tabs>

### Verify removal

After uninstalling, confirm that artef is no longer available globally:

<Tabs groupId="verify-os">
  <TabItem value="mac-linux" label="Mac / Linux" default>
    ```bash
    which -a artef
    ```
  </TabItem>
  <TabItem value="windows" label="Windows">
    ```bash
    where artef
    ```
  </TabItem>
</Tabs>

If this still returns a path, you have another global installation that needs to be removed. Note that project-local installs (`node_modules/.bin/artef`) are not detected by these commands — remove those with the project dependency step above.

### Remove configuration and data (optional)

artef stores configuration, eval history, and cached results in `~/.artef` (`%USERPROFILE%\.artef` on Windows). Uninstalling the package does not remove this directory.

:::warning
This permanently deletes your eval history, database, and cached results.
:::

<Tabs groupId="cleanup-os">
  <TabItem value="mac-linux" label="Mac / Linux" default>
    ```bash
    rm -rf ~/.artef
    ```
  </TabItem>
  <TabItem value="windows-ps" label="Windows (PowerShell)">
    ```powershell
    Remove-Item -Recurse -Force "$env:USERPROFILE\.artef"
    ```
  </TabItem>
  <TabItem value="windows-cmd" label="Windows (CMD)">
    ```cmd
    rmdir /s /q "%USERPROFILE%\.artef"
    ```
  </TabItem>
</Tabs>

If you set custom paths via environment variables, remove those directories as well:

- `artef_CONFIG_DIR` — configuration and database
- `artef_CACHE_PATH` — cached results
- `artef_LOG_DIR` — log files

## See Also

- [Getting Started](./getting-started.md)
- [Troubleshooting](./usage/troubleshooting.md)
- [Contributing](./contributing.md)
