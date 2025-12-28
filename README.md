# FinTech Efficiency Calculator

A premium interactive dashboard built with Vue.js to help professionals discover their "Efficiency Gap" - the years they're losing by not optimizing home equity.

## Features

- **Interactive Sliders**: 5 custom sliders for age, equity, cash, savings, and investment interest
- **Real-time Calculations**: Instant updates as you adjust inputs
- **Visual Charts**: Beautiful line chart comparing baseline vs optimized trajectories
- **Animated Odometer**: Smooth number animations showing years gained
- **Optimization Toggle**: Switch between baseline and optimized strategies
- **Lead Capture**: Email form with validation and WhatsApp sharing
- **Dark FinTech Theme**: Premium aesthetic inspired by Stake, Revolut, and Apple Health
- **Fully Responsive**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Chart.js** (Data visualization)
- **CSS Custom Properties** (Design system)

## Project Structure

```
fintech-calculator/
├── public/                 # Static assets
├── src/
│   ├── components/         # Vue components
│   │   ├── common/        # Shared UI components
│   │   └── calculator/    # Calculator-specific components
│   ├── composables/       # Vue composables (business logic)
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── assets/
│   │   └── styles/        # CSS files
│   ├── App.vue            # Main app component
│   └── main.js            # Entry point
├── .github/
│   └── workflows/         # CI/CD workflows
├── vite.config.js         # Vite configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Harrysibbenga/fin-tech-flight-deck.git
cd fin-tech-flight-deck
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. **Automatic Deployment via GitHub Actions:**
   - Push to `main` branch triggers automatic deployment
   - Requires Vercel secrets configured in GitHub:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

2. **Manual Deployment:**
   ```bash
   npm install -g vercel
   vercel
   ```

### Environment Variables

No environment variables are required for basic functionality. If you need to integrate with APIs for email submission or PDF generation, add them in Vercel dashboard or via `.env.local` for local development.

## Configuration

### Sliders

Slider configurations are defined in `src/config/sliders.config.js`. You can easily add, remove, or modify sliders by updating this file.

### Calculations

Calculation logic is in `src/composables/useCalculations.js`. The formulas can be customized based on your requirements.

### Styling

The design system uses CSS custom properties defined in `src/assets/styles/variables.css`. Modify these to change colors, typography, spacing, etc.

## Performance

- **Bundle Size**: Optimized for < 200kb gzipped
- **Lighthouse Score**: Target 90+ (desktop), 85+ (mobile)
- **Rendering**: Uses `v-memo` for expensive renders
- **Animations**: 60fps with debounced inputs (16ms)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Safari: Latest 2 versions (iOS + macOS)
- Firefox: Latest 2 versions
- Mobile Safari iOS: 14+
- Chrome Android: Latest

## Development Guidelines

### Component Structure

Components follow Vue 3 Composition API best practices:
- Use `<script setup>` syntax
- Props are clearly defined with types
- Emits are explicitly declared
- Styles are scoped

### Code Style

- ESLint is configured for Vue 3
- Use consistent naming: PascalCase for components, camelCase for variables
- Add JSDoc comments for complex functions

### Commits

Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `perf:` Performance improvements
- `chore:` Maintenance tasks
- `docs:` Documentation updates

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create a pull request

## License

© 2024 Wealth Optimization. For illustration purposes only.

## Support

For issues or questions, please open an issue on GitHub.

