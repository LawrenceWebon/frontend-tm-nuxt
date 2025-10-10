# Frontend Project Structure Explanation

This document explains the file and folder structure of the Nuxt 4 frontend application for the Task Management system.

## Overview

The project follows a **Feature-Based Architecture** with a clear separation of concerns, making it scalable, maintainable, and easy to understand. The structure is organized around business features rather than technical layers.

## Root Directory Structure

```
frontend-nuxt4/
├── app/                    # Main application code (Nuxt 4 app directory)
├── assets/                 # Static assets (CSS, fonts, icons, images)
├── docs/                   # Project documentation
├── public/                 # Public static files
├── server/                 # Server-side code and API routes
├── stores/                 # Global Pinia stores (legacy)
├── tests/                  # Test files (e2e, integration, unit)
├── types/                  # Global TypeScript type definitions
├── app.vue                 # Root Vue component
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## App Directory Structure (`app/`)

The `app/` directory is the heart of the Nuxt 4 application and contains all the application logic organized by features.

### 1. Features Directory (`app/features/`)

The features directory implements a **Feature-Based Architecture** where each feature is self-contained and includes all its related code.

#### Purpose of Features
- **Modularity**: Each feature is independent and can be developed, tested, and maintained separately
- **Scalability**: Easy to add new features without affecting existing ones
- **Team Collaboration**: Different developers can work on different features simultaneously
- **Code Organization**: Related functionality is grouped together, making it easier to find and understand

#### Feature Structure Pattern
Each feature follows this consistent structure:

```
app/features/[feature-name]/
├── components/             # Vue components specific to this feature
│   ├── business/          # Business logic components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── composables/           # Vue composables for this feature
├── constants/             # Feature-specific constants
├── stores/                # Pinia stores for state management
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

#### Current Features

**1. Auth Feature (`app/features/auth/`)**
- **Purpose**: Handles user authentication, login, logout, registration
- **Components**: Login forms, auth layouts, UI components
- **Composables**: `useAuth.ts` - Authentication logic and state management
- **Stores**: `auth.ts` - User state, token management, authentication status
- **Types**: User interfaces, auth responses, error types
- **Utils**: Authentication helper functions

**2. Tasks Feature (`app/features/tasks/`)**
- **Purpose**: Manages task CRUD operations, task lists, task management
- **Components**: 
  - `business/` - `DraggableTaskList.vue`, `TaskItem.vue` (core business logic)
  - `forms/` - Task creation and editing forms
  - `ui/` - `SearchBar.vue`, `SortControls.vue` (reusable UI components)
- **Composables**: `useTask.ts` - Task-related business logic
- **Stores**: `task.ts` - Task state management
- **Types**: Task interfaces, API responses
- **Utils**: Task manipulation helpers

### 2. Shared Directory (`app/shared/`)

Contains code that is shared across multiple features or is globally applicable.

#### Structure and Purpose

```
app/shared/
├── components/            # Reusable components across features
│   ├── AppHeader.vue      # Main application header
│   ├── AppSidebar.vue     # Main application sidebar
│   ├── feedback/          # Notification and feedback components
│   ├── forms/             # Reusable form components
│   ├── layout/            # Layout components
│   └── ui/                # Base UI components (Button, SkipLinks)
├── composables/           # Global composables
│   ├── useAccessibility.ts # Accessibility utilities
│   ├── useApi.ts          # API communication layer
│   ├── useClickOutside.ts # Click outside detection
│   ├── useDateFilter.ts   # Date filtering logic
│   └── useNotification.ts # Notification system
├── constants/             # Global constants
├── types/                 # Global TypeScript types
│   └── nuxt.d.ts         # Nuxt-specific type definitions
└── utils/                 # Global utility functions
    └── accessibility.ts   # Accessibility helper functions
```

### 3. Other App Directories

**Layouts (`app/layouts/`)**
- `default.vue` - Default application layout
- `auth.vue` - Authentication pages layout

**Middleware (`app/middleware/`)**
- `auth.ts` - Authentication middleware
- `guest.ts` - Guest-only route protection
- `role.ts` - Role-based access control

**Pages (`app/pages/`)**
- Vue pages for routing (login, register, tasks, etc.)
- Follows Nuxt's file-based routing system

**Plugins (`app/plugins/`)**
- `auth.client.ts` - Client-side authentication plugin

## Directory Purposes Explained

### Components
- **Purpose**: Vue components that render UI elements
- **Organization**: 
  - `business/` - Components with complex business logic
  - `forms/` - Form-related components
  - `layout/` - Layout and structural components
  - `ui/` - Reusable, generic UI components
- **Location**: Both in features (feature-specific) and shared (reusable)

### Composables
- **Purpose**: Vue 3 Composition API functions that encapsulate reactive logic
- **Benefits**: Reusable, testable, and composable logic
- **Examples**: 
  - `useAuth` - Authentication state and methods
  - `useApi` - HTTP request handling
  - `useNotification` - Toast notifications
- **Location**: Feature-specific composables in features, global ones in shared

### Constants
- **Purpose**: Store configuration values, enums, and static data
- **Examples**: API endpoints, validation rules, default values
- **Benefits**: Centralized configuration, easy to maintain and update
- **Location**: Both feature-specific and global constants

### Stores (Pinia)
- **Purpose**: Centralized state management using Pinia
- **Benefits**: Reactive state, devtools support, type safety
- **Examples**: 
  - `auth.ts` - User authentication state
  - `task.ts` - Task management state
- **Location**: Feature-specific stores in features, global stores in shared

### Types
- **Purpose**: TypeScript type definitions and interfaces
- **Benefits**: Type safety, better IDE support, documentation
- **Examples**: User interfaces, API response types, component props
- **Location**: Feature-specific types in features, global types in shared

### Utils
- **Purpose**: Pure utility functions and helper methods
- **Benefits**: Reusable logic, easier testing, separation of concerns
- **Examples**: Date formatting, validation functions, data transformation
- **Location**: Feature-specific utils in features, global utils in shared

## Configuration and Aliases

The project uses path aliases for clean imports:

```typescript
// nuxt.config.ts
alias: {
  '~': '.',
  '@': './app',
  '@shared': './app/shared',
  '@features': './app/features'
}
```

This allows imports like:
```typescript
import { useAuth } from '@features/auth/composables/useAuth'
import { useApi } from '@shared/composables/useApi'
```

## Benefits of This Structure

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Related code is grouped together, making it easier to find and modify
3. **Team Collaboration**: Different developers can work on different features independently
4. **Code Reusability**: Shared components and utilities can be used across features
5. **Type Safety**: Strong TypeScript integration throughout the application
6. **Testing**: Each feature can be tested independently
7. **Performance**: Code splitting by features improves bundle size

## Development Workflow

1. **New Feature**: Create a new directory in `app/features/` following the established pattern
2. **Shared Code**: Add reusable code to `app/shared/`
3. **Components**: Place feature-specific components in the feature's components directory
4. **State Management**: Use Pinia stores for feature-specific state
5. **API Communication**: Use the shared `useApi` composable for HTTP requests
6. **Styling**: Use Tailwind CSS classes for styling

This structure promotes clean code, better organization, and makes the application easier to scale and maintain as it grows.
