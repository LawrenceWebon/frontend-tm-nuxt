# Environment Configuration

This document explains how to configure the application for different environments.

## Environment Files

The application uses the following environment files:

- `.env` - Development environment (default)
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.example` - Template file with all available variables

## Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env` for your development environment:**
   ```bash
   # Edit .env file with your local configuration
   nano .env
   ```

3. **For staging/production, update the respective files:**
   ```bash
   # Edit staging configuration
   nano .env.staging
   
   # Edit production configuration
   nano .env.production
   ```

## Environment Variables

### Required Variables

- `NUXT_PUBLIC_API_BASE` - Base URL for the API server
- `NUXT_PUBLIC_API_URL` - Full API URL including path

### Optional Variables

- `NUXT_PUBLIC_APP_NAME` - Application name
- `NUXT_PUBLIC_APP_URL` - Application URL
- `NUXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics (true/false)
- `NUXT_PUBLIC_ENABLE_DEBUG` - Enable debug mode (true/false)
- `NUXT_PUBLIC_CSRF_ENABLED` - Enable CSRF protection (true/false)
- `NUXT_PUBLIC_DEV_TOOLS` - Enable development tools (true/false)

## Running Different Environments

### Development
```bash
npm run dev
# or
pnpm dev
```

### Staging
```bash
npm run dev:staging
# or
pnpm dev:staging
```

### Production
```bash
npm run dev:production
# or
pnpm dev:production
```

## Building for Different Environments

### Development Build
```bash
npm run build
```

### Staging Build
```bash
npm run build:staging
```

### Production Build
```bash
npm run build:production
```

## Environment-Specific Configuration

### Development (.env)
- Uses localhost URLs
- Debug mode enabled
- Development tools enabled
- Analytics disabled

### Staging (.env.staging)
- Uses staging server URLs
- Debug mode enabled
- Analytics enabled
- Development tools disabled

### Production (.env.production)
- Uses production server URLs
- Debug mode disabled
- Analytics enabled
- Development tools disabled

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique values for production
- Regularly rotate API keys and tokens
- Use HTTPS in production environments
