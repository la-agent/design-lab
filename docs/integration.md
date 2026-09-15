# Integration and updates

## Two ways to use the repository

1. **Template workspace:** copy this repository with GitHub's Use this template. It includes a working framework snapshot and examples. This is the lowest-friction start: no access to the upstream repository is required after the initial copy/install. The tradeoff is manual framework updates.
2. **Framework consumer:** an existing Next.js application depends on the original repository at a full commit SHA. Its designs remain in its own repository. This keeps framework fixes centralized.

Do not assume template projects auto-update. Never copy a team's designs into the framework to distribute fixes.

## Next.js host

Install a reviewed revision in the host's package.json:

```json
{ "dependencies": { "@la-agent/design-lab": "git+https://github.com/la-agent/design-lab.git#FULL_COMMIT_SHA" } }
```

Replace FULL_COMMIT_SHA with a real reviewed 40-character commit from the repository; don't paste it literally. Use `gh auth setup-git` if Git cannot authenticate. Some pnpm/Git configurations record the dependency using GitHub SSH in the lockfile. In that case, the installing machine or CI also needs authorized GitHub SSH access, or an organization-approved URL rewrite to its existing HTTPS credentials. Keep tokens out of dependency URLs. Run pnpm install and commit the lockfile.

Set `transpilePackages: ["@la-agent/design-lab"]` in next.config.mjs. Use the same React version as the host to avoid duplicate React instances. The framework ships TypeScript and CSS Modules and is compiled by Next.

The package exposes explicit subpaths: shell, canvas, preview, history, types, files, workspace, decisions, layouts, error, route-error, globals.css, and sync. See package.json for their source files and types.

- Mount `LabShell` with serializable `files` and `config`. Render your workspace children inside it.
- `CanvasStudy` takes pages and a renderBoard function. `PreviewBoard` takes a board and its same-origin preview URL.
- Wire `/api/design-decisions` with `createDecisionHandlers({ files })` and `/api/layouts` with `createLayoutHandlers({ files })`. Paths default to the host's `.studio/` directory; a trusted host can supply another fixed path.
- Existing apps can supply their own registry, routes and renderers. They need not migrate every design into folder discovery at once.
- To use conventions, use the starter app adapters and the installed `design-lab dev` / `design-lab sync` binary. The binary resolves Next from the host and scans the current working directory.
- A monorepo must keep its production applications independent of experimental design workspaces. Run each design host on a separate loopback port and keep its credentials/data separate.

## Updating template-created workspaces

For the initial snapshot, the owner may deliberately merge upstream changes confined to studio/, bin/, docs/ and required dependency updates, checking their workspace afterwards. Do not blanket-reset a template checkout to upstream.

For ongoing centralized updates, convert it into a consumer: rename its package to its own project name, add the upstream Git dependency pinned to a reviewed commit, replace local `node bin/design-lab.mjs` scripts with the installed `design-lab` binary, and then remove the now-unused local framework source once verified. Imports already use package subpaths. Keep designs, assets, configuration, app adapters and saved state. Run a clean install, typecheck, tests, and browser verification before accepting the conversion.

## Framework development

Change studio/ and bin/, update behavior tests and documentation, run pnpm check and pnpm test, then test the starter and a real consuming app. Use a local pnpm pack tarball for pre-publication integration; commit-pin the final Git revision in consumers. A Git dependency must not rely on source outside this repository, a developer's absolute paths, local symlinks, generated output missing from the package, or private environment variables.
