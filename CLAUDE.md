# Claude Development Notes

## Project Overview
This is a React Native heatmap component library (`@dt-workspace/react-native-heatmap`) created with Claude Code. The library provides a modern, highly customizable heatmap component inspired by GitHub's contribution calendar.

## Development Commands

### Package Management
```bash
# Install dependencies
yarn install

# Add new dependency
yarn add <package-name>

# Add dev dependency
yarn add -D <package-name>
```

### Building & Testing
```bash
# Build the library
npm run prepare

# Run tests
npm test
# or
yarn test

# Type checking
npm run typecheck
# or
yarn typecheck

# Linting
npm run lint
# or
yarn lint

# Fix linting issues
npm run lint -- --fix
```

### Development
```bash
# Run example app
npm run example
# or
yarn example

# Clean build files
npm run clean
# or
yarn clean
```

### Publishing
```bash
# Build and publish to NPM
npm run prepare
npm publish --access public

# Create release
npm run release
```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Heatmap.tsx          # Main heatmap component
│   ├── types.ts                 # TypeScript interfaces and types
│   ├── utils/
│   │   └── index.ts            # Utility functions
│   └── index.tsx               # Main export file
├── example/                    # Example React Native app
├── lib/                       # Built output (auto-generated)
├── __tests__/                 # Jest tests
├── docs/                      # Documentation
│   ├── feature.md             # Technical specifications
│   └── usecase.md             # Use case examples
└── README.md                  # Main documentation
```

## Key Features Implemented

### Core Components
- **Heatmap Component**: Main SVG-based heatmap with customizable layouts
- **Color Schemes**: 10 predefined schemes (GitHub, heat, cool, purple, etc.)
- **Layout Options**: Calendar, grid, and compact layouts
- **TypeScript Support**: Full type safety with comprehensive interfaces

### Utility Functions
- `processHeatmapData`: Normalizes and processes input data
- `calculateColor`: Handles color interpolation for smooth gradients
- `generateDateRange`: Creates date ranges for calendar layouts
- `resolveColorScheme`: Resolves color scheme configurations

### Testing
- **40+ Unit Tests**: Comprehensive test coverage
- **Component Testing**: React Native Testing Library
- **Utility Testing**: Jest for utility functions
- **Mock Setup**: Proper mocking for react-native-svg

## Development Notes

### Dependencies
- **react-native-svg**: ^15.12.0 (peer dependency for SVG rendering)
- **React Native**: 0.70+ compatibility
- **TypeScript**: 5.8+ support

### Build Configuration
- **react-native-builder-bob**: Module and TypeScript builds
- **ESLint**: Code quality with React Native config
- **Prettier**: Code formatting
- **Jest**: Testing framework

### Performance Considerations
- Uses `useMemo` for expensive calculations
- `useCallback` for event handlers
- Efficient SVG rendering with minimal re-renders
- Optimized color interpolation algorithms

## Common Development Tasks

### Adding New Color Schemes
1. Add to `COLOR_SCHEMES` object in `src/types.ts`
2. Update TypeScript interfaces if needed
3. Add tests in `__tests__/index.test.tsx`
4. Update documentation

### Adding New Layouts
1. Implement layout logic in `src/utils/index.ts`
2. Add layout type to `LayoutType` in `src/types.ts`
3. Update component rendering in `src/components/Heatmap.tsx`
4. Add comprehensive tests

### Version Management
- Follow semantic versioning (semver)
- Update version in `package.json`
- Create git tags for releases
- Update CHANGELOG.md (if present)

## Troubleshooting

### Common Issues
1. **SVG Not Rendering**: Ensure react-native-svg is properly installed
2. **TypeScript Errors**: Check TypeScript version compatibility
3. **Build Failures**: Run `npm run clean` then `npm run prepare`
4. **Test Failures**: Check mock configurations for react-native-svg

### Build Process
The library uses `react-native-builder-bob` with two targets:
- **module**: ES6 modules for modern bundlers
- **typescript**: Type definitions for TypeScript support

## Contributing Guidelines

### Code Style
- Follow existing TypeScript patterns
- Use ESLint and Prettier configurations
- Write comprehensive tests for new features
- Update documentation for API changes

### Git Workflow
- Create feature branches from `main`
- Use conventional commit messages
- Include tests with new features
- Update documentation as needed

### Testing
- Maintain 90%+ test coverage
- Test all public APIs
- Include edge cases and error scenarios
- Use React Native Testing Library for components

## Release Process

1. Update version in `package.json`
2. Run `npm run prepare` to build
3. Run `npm test` to ensure all tests pass
4. Run `npm run lint` to check code quality
5. Commit changes and create git tag
6. Push to GitHub
7. Run `npm publish --access public`
8. Create GitHub release with notes

## Links
- **NPM Package**: https://www.npmjs.com/package/@dt-workspace/react-native-heatmap
- **GitHub Repository**: https://github.com/dt-workspace/react-native-heatmap
- **Documentation**: See README.md and docs/ folder
- **Issues**: https://github.com/dt-workspace/react-native-heatmap/issues