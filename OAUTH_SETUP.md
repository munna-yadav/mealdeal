# OAuth Setup Guide for MealDeal

This guide will help you set up OAuth authentication providers for your MealDeal application.

## Required Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## Setting Up OAuth Providers

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your `.env.local` file

### 2. GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: MealDeal
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and Client Secret to your `.env.local` file

### 3. Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "OAuth2" → "General"
4. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/discord` (development)
   - `https://yourdomain.com/api/auth/callback/discord` (production)
5. Copy the Client ID and Client Secret to your `.env.local` file

## Generating NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Features

- **Multiple OAuth Providers**: Google, GitHub, and Discord
- **Hybrid Authentication**: OAuth + Email/Password
- **Automatic Verification**: OAuth users are automatically verified
- **Seamless Integration**: Works alongside existing authentication system
- **Session Management**: JWT-based sessions with NextAuth.js

## How It Works

1. Users can sign in/sign up using OAuth providers
2. OAuth users are automatically marked as verified
3. The system maintains compatibility with existing email/password users
4. Sessions are managed through NextAuth.js
5. User data is stored in the existing User table

## Troubleshooting

- Ensure all environment variables are set correctly
- Check that redirect URIs match exactly (including protocol and port)
- Verify that OAuth apps are properly configured in provider dashboards
- Check browser console and server logs for error messages

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Regularly rotate OAuth client secrets
- Monitor OAuth app usage and permissions

