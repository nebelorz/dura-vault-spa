[<img src="https://dura-vault.vercel.app/banner-darkmode.png" alt="dura-vault-banner"/>](https://dura-vault.vercel.app/)

# Dura Vault SPA

> A modern web application for exploring Dura Online player statistics, highscores, and rankings

Built with Angular 21, this single-page application provides comprehensive data visualization and tracking for Dura Online players. Monitor skill rankings, analyze player progression, and explore historical statistics through an intuitive interface.

---

## Features

**Core Functionality**

- Highscore tables filtered by skill and time period (daily, weekly, monthly, yearly, all-time)
- Detailed player profiles with progression charts and summarized stats
- Smart caching system for optimized data loading
- Theme support with dark/light mode toggle
- Interactive Chart.js visualizations for trend analysis

**Technical Highlights**

- Angular 21 with standalone components architecture
- Signal-based reactive state management
- PrimeNG component library for consistent UI
- Supabase backend integration
- Responsive design optimized for all devices

---

## Technology Stack

| Technology                                    | Version | Purpose                                                   |
| --------------------------------------------- | ------- | --------------------------------------------------------- |
| [Angular](https://angular.dev/)               | 21.0.0  | Frontend framework with signals and standalone components |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.2   | Type-safe development                                     |
| [PrimeNG](https://primeng.org/)               | 18.0.0  | UI component library                                      |
| [Supabase](https://supabase.com/)             | Latest  | Backend and data management                               |
| [Chart.js](https://www.chartjs.org/)          | 4.4.8   | Interactive data visualization                            |
| [SCSS](https://sass-lang.com/)                | -       | Styling with preprocessor capabilities                    |

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nebelorz/dura-vault-spa.git
   cd dura-vault-spa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment** (if needed)

   The application uses environment variables for API configuration. Default settings work out of the box, but you can customize them in:
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

### Development Server

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to source files.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

---

## Available Commands

| Command          | Description                                         |
| ---------------- | --------------------------------------------------- |
| `npm start`      | Start development server on `http://localhost:4200` |
| `npm run build`  | Build production-ready application                  |
| `npm test`       | Execute unit tests via Karma                        |
| `npm run eslint` | Run ESLint for code quality checks                  |

---

---

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core application logic
│   │   ├── constants/           # Application-wide constants and configuration
│   │   ├── models/              # TypeScript interfaces and type definitions
│   │   └── services/            # Angular services (API, cache, state management)
│   │
│   ├── features/                # Feature modules and components
│   │   ├── footer/              # Application footer
│   │   ├── highscore-table/     # Highscore rankings and filtering
│   │   ├── landing-page/        # Home page with dashboard widgets
│   │   ├── nav-bar/             # Navigation bar with search
│   │   └── player-detail/       # Player profile and statistics
│   │
│   ├── shared/                  # Reusable components and utilities
│   │   ├── components/          # Shared UI components
│   │   ├── functions/           # Utility functions (formatting, calculations)
│   │   ├── pipes/               # Custom Angular pipes
│   │   └── styles/              # SCSS variables, mixins, and themes
│   │
│   └── environments/            # Environment-specific configuration
│
├── styles.scss                  # Global styles
└── main.ts                      # Application entry point
```

### Architecture Principles

The application follows Angular best practices with a feature-based architecture:

- **Core Module**: Contains singleton services, models, and app-wide utilities
- **Feature Modules**: Self-contained features with their own components and logic
- **Shared Module**: Reusable components, pipes, and utilities used across features
- **Standalone Components**: Modern Angular architecture without NgModules
- **Path Aliases**: Clean imports using `@core`, `@shared`, `@features`, and `@env`

---

## Code Standards

This project maintains high code quality through:

- **Strict TypeScript**: Full type safety with strict mode enabled
- **Angular Signals**: Modern reactive state management
- **Component Architecture**: Atomic design with smart/presentational component separation
- **Service Layer**: Centralized business logic and API communication via `BaseApiService`
- **Style Organization**: SCSS with `includePaths` for simplified imports
- **Barrel Exports**: Clean module exports through index files
- **ESLint**: Automated code quality checks

---

## Contributing

Contributions are welcome! If you'd like to improve the project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style conventions and passes ESLint checks.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

**Dev**: Discord `neBelorz#8759`  
**Live Application**: [https://dura-vault.vercel.app/](https://dura-vault.vercel.app/)

---

_Built with Angular 21 for the Dura Online community_
