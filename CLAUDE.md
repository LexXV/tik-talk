This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Build & Development Commands

# Build production
ng build

# Run development server
ng serve

# Run tests
ng test

# Run linter
ng lint

# Run single test file
ng test --include='**/*spec.ts' --watch=false

# Serve build for testing
ng serve --host 0.0.0.0

Architecture Overview

Tech Stack: Angular (Standalone Components, Signals, Router, Interceptors, Guards)

Key Modules:

- app/ - Root app configuration, routing, guards
- common-ui/ - Reusable layout components (sidebar, profile-card, subscriber-card)
- auth/ - Authentication logic (guards, interceptors, auth service/interface)
- models/ - TypeScript interfaces/models
- services/ - Business logic services
- features/ - Feature-specific components
- shared/ - Shared utilities, pipes, directives

Key Files to Understand:

- src/app/app.routes.ts - Route configuration and navigation
- src/app/auth/access.guard.ts - Route protection logic
- src/app/auth/auth.interceptor.ts - Request/response interception
- src/app/common-ui/layout/layout.* - Main app layout

TypeScript & Angular Patterns

- Uses standalone components with standalone: true
- Signals for state management (e.g., signal() imports)
- RxJS for reactive streams in services (Observables, Subjects)
- Guards for route protection (AccessGuard, AuthGuard patterns)

Important Notes

- Font Assets: JetBrains Mono fonts are included in public/assets/fonts/
- Icon Assets: SVG icons in public/assets/svg/
- Auth Flow: Uses interceptor + guard pattern for authenticated routes
- Layout Structure: Sidebar (subscriber cards) + Main content area

Quick Reference

┌───────────────────┬─────────────────────────┐
│       Task        │         Command         │
├───────────────────┼─────────────────────────┤
│ Start dev server  │ ng serve                │
├───────────────────┼─────────────────────────┤
│ Build production  │ ng build                │
├───────────────────┼─────────────────────────┤
│ Test suite        │ ng test                 │
├───────────────────┼─────────────────────────┤
│ Lint check        │ ng lint                 │
├───────────────────┼─────────────────────────┤
│ Serve for testing │ ng serve --host 0.0.0.0 │
└───────────────────┴─────────────────────────┘
