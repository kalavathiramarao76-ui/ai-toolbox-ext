# SixForge — 6-in-1 AI Writing Suite

![Version](https://img.shields.io/badge/version-1.0.0-7c3aed?style=flat-square)
![License](https://img.shields.io/badge/license-ISC-7c3aed?style=flat-square)
![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-7c3aed?style=flat-square&logo=googlechrome&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)

> Six professional AI writing tools in one Chrome extension — emails, meeting notes, code reviews, blog posts, product copy, and tweet threads, all powered by SharedLLM.

<p align="center">
  <img src="src/assets/logo.svg" alt="SixForge Logo" width="128" />
</p>

## Features

- :email: **Email Writer** — Generate polished professional emails with configurable tone, length, and intent
- :clipboard: **Meeting Summarizer** — Paste raw meeting notes and get structured summaries with action items and decisions
- :mag: **Code Reviewer** — AI-powered code review supporting 14 languages (JavaScript, TypeScript, Python, Go, Rust, Java, C++, Ruby, PHP, Swift, Kotlin, Scala, Dart, C#)
- :memo: **Blog Generator** — Create SEO-friendly blog posts with customizable structure, headings, and call-to-actions
- :package: **Product Copywriter** — Generate compelling product descriptions, taglines, and feature highlights
- :bird: **Tweet Thread Creator** — Turn ideas into engaging Twitter/X threads with hooks and hashtags
- :lock: **Firebase Authentication** — Secure sign-in with Google OAuth
- :art: **Purple Theme** — Cohesive purple-accented dark UI across all tools

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Auth | Firebase |
| AI Model | SharedLLM API (gpt-oss:120b) |
| Platform | Chrome Extension (Manifest V3) |

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ai-toolbox-ext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Create a `.env` file with your Firebase and SharedLLM API credentials

4. **Build the extension**
   ```bash
   npm run build
   ```

5. **Load in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `dist` folder

## Usage

1. Click the SixForge icon in the Chrome toolbar to open the popup
2. Sign in with your Google account via Firebase
3. Select one of the six writing tools from the dashboard
4. Enter your input (email context, meeting notes, code snippet, etc.)
5. Configure options (tone, length, language) and click **Generate**
6. Copy the AI-generated output to your clipboard with one click

## Architecture

```
ai-toolbox-ext/
├── public/
│   └── icons/              # Extension icons (16, 32, 48, 128px)
├── src/
│   ├── assets/
│   │   └── logo.svg        # SixForge logo
│   ├── components/         # React UI components
│   ├── services/           # SharedLLM API & Firebase services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Shared utilities
│   └── App.tsx             # Main application entry
├── manifest.json           # Chrome Manifest V3 config
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind theme (purple)
└── package.json
```

## Screenshots

<p align="center">
  <img src="public/icons/icon128.png" alt="SixForge Icon" width="128" />
</p>

| Icon | Size |
|------|------|
| ![16px](public/icons/icon16.png) | 16x16 |
| ![32px](public/icons/icon32.png) | 32x32 |
| ![48px](public/icons/icon48.png) | 48x48 |
| ![128px](public/icons/icon128.png) | 128x128 |

## License

ISC
