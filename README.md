[<img src="https://dura-vault.vercel.app/banner-darkmode.png" alt="dura-vault-banner"/>](https://dura-vault.vercel.app/) <!-- Banner -->

# Dura Vault SPA

Modern Angular Single Page Application for Dura Online statistics and player data.

## Overview

Dura Vault SPA is a feature-rich, responsive web app for exploring Dura Online highscores, player histories, and global stats. It leverages Angular 21, Angular Signals, PrimeNG UI, and Supabase for a fast, modern user experience.

## Features

- Highscore tables by skill/section and period (day, week, month, year, all)
- Player detail pages with history, charts, and summaries
- Data caching for performance
- Dark mode toggle and theming

## Technologies

- [Angular 21+](https://angular.dev/) (standalone components, signals)
- [PrimeNG](https://primeng.org/) & PrimeIcons for UI
- [Supabase](https://supabase.com/) for backend data
- [Chart.js](https://www.chartjs.org/) for charts

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/nebelorz/dura-vault-spa.git
cd dura-vault-spa
npm install
```

### Development

Start the local dev server:

```bash
npm start
# or
ng serve
```

Visit [http://localhost:4200](http://localhost:4200)

### Build

```bash
ng build
# Output in dist/
```

## Project Structure

```
src/
	app/
		core/         # Models & services (API, cache, theme, navigation etc.)
			models/     # TypeScript interfaces for data
			services/   # Angular services (data, cache, toast, etc.)
		features/     # Main UI features (highscore-table, player-detail, nav-bar, landing-page, footer)
		shared/       # Reusable components, pipes, functions, SCSS
			functions/  # Utility functions (date, number formatting, etc.)
			pipes/      # Angular pipes (abbreviate, remove minus, etc.)
			SCSS/       # Shared SCSS variables/mixins
	environments/   # Environment configs (Supabase, API URLs)
	index.html      # App entry point
	main.ts         # Angular bootstrap
	styles.scss     # Global styles
```

## Coding Standards & Best Practices

- Angular 21+ with strict TypeScript
- Standalone components and signals for state
- Feature-based folder structure
- PrimeNG for consistent UI
- Caching and error handling in services

## Key Scripts

- `npm start` / `ng serve` — Start dev server
- `ng build` — Build for production
- `ng test` — Run unit tests
- `npm run eslint` — Lint code

## Deployment

- Static build output in `dist/`
- Vercel config in `vercel.json` for deployment

## Contributing

Pull requests and issues are welcome! Please follow Angular and project coding standards.

## License

MIT License — see [LICENSE](LICENSE)
