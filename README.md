# Hendrikboon.nl

**Live site**: https://www.hendrikboon.nl 🚀

Personal portfolio website built with Angular + live Strava stats via a custom PHP API.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` (or `ng build --configuration production` for production).

The build artifacts will be stored in the `dist/` directory and will automatically include:

- The compiled Angular app
- The full PHP API in `/api/strava/`

## Important: secrets.php (required for the Strava API)

The Strava API needs the client credentials and refresh token. These are **never committed** to Git.

### Files

secrets.php          ← create this file in the project root (add to .gitignore)

### Create `secrets.php` locally

```php
<?php
// secrets.php — NEVER commit this file!
define('STRAVA_CLIENT_ID', 'your_client_id_here');
define('STRAVA_CLIENT_SECRET', 'client_secret_here');
define('STRAVA_REFRESH_TOKEN', 'refresh_token_here');
```
