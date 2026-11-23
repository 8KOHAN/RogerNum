# RogerNum release preparation

1. Extract the complete `RogerNum-release-preparation-GPL3.zip` archive into the existing RogerNum repository root, preserving its directory structure and replacing only files it contains. The archive includes the GPL-3.0 license, README, release preparation script, and modified/new source files.
2. Open PowerShell in the RogerNum project root and run:

   ```powershell
   node release-prep/prepare-release.mjs
   ```

   The script updates `package.json` metadata to version `1.0.0` and license `GPL-3.0-only`, synchronizes the package lock's root name/version, checks the `storage` permission, removes only the known placeholder Google content script, and checks expected icon names and dimensions. It does not install or update dependencies.
3. Review every warning. Confirm that your actual artwork exists as `public/icon-16.png`, `public/icon-48.png`, and `public/icon-128.png`. The script will not generate or overwrite icon artwork.
4. Run the TypeScript check and builds:

   ```powershell
   npm run compile
   npm run build:firefox
   npm run build:chrome
   ```

5. Inspect generated manifests in `.output/` and verify the name, version `1.0.0`, `storage` permission, and absence of unnecessary host permissions or content scripts.
6. Test both builds in the target browsers. Do not submit the extension until all local checks pass.

The script only changes local files. It does not push commits to GitHub or publish to a browser store.
