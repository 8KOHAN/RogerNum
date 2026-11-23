# RogerNum

**RogerNum** is an open-source browser extension for generating random numbers. It is built with React, TypeScript, and WXT.

## Features

- Generate one random integer or multiple numbers in a single request.
- Choose the minimum and maximum values for the generated range.
- Save the selected range and other preferences locally in the browser.
- Choose from 12 interface themes: Light, Dark, Gold, Ocean, Forest, Violet, Graphite, Mint, Sakura, Coffee, Emerald, and Lavender.
- Use the interface in 12 languages: English, Ukrainian, Spanish, German, Brazilian Portuguese, French, Japanese, Simplified Chinese, Korean, Russian, Arabic, and Italian.
- Detect a supported language from the browser preferences on first launch, falling back to English. A manually selected language is saved and takes priority.
- Use the system light/dark appearance until a theme is selected manually.
- Copy a generated number or the full list of generated numbers.

## Development

Requirements: Node.js and npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run the TypeScript check:

```bash
npm run compile
```

Build the extension:

```bash
npm run build
```

If browser-specific scripts are configured in `package.json`, build for Firefox or Chrome with:

```bash
npm run build:firefox
npm run build:chrome
```

WXT writes build output to `.output/`. Use the appropriate browser-specific build output when packaging the extension for a store.

## Permissions and privacy

RogerNum stores preferences such as the selected theme, language, range, and multiple-number settings in local browser storage. The core number-generation feature does not require reading the contents of websites or using a remote backend.

The `storage` permission is used to save preferences. Keep the extension's published permission declarations and privacy disclosures aligned with the actual release build.

## Contributing

Issues and pull requests are welcome. Please describe the proposed change and include steps to reproduce or verify it where applicable.

## License

RogerNum is free and open-source software distributed under the **GNU General Public License v3.0 (GPL-3.0)**. You may use, study, modify, and redistribute the project under the terms of this license.

When distributing copies or modified versions, comply with the GPL-3.0 requirements, including the applicable source-code and license notices. The license does not prohibit commercial use or selling copies; redistribution must follow its terms.

See [LICENSE](LICENSE) for the complete license text.
