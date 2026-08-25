# Hono URL Shortener

[Read in Russian](README.ru.md) | English

Lightweight URL Shortener REST API built with Hono, Bun, Valibot, and OpenAPI.

## Features

- **Validation:** Runtime schema validation with Valibot.
- **OpenAPI / Scalar:** Self-documenting API at `/scalar` (disabled in production).
- **Errors:** Standardized JSON error format (`{ "error": "..." }`).
- **Tests:** Integrated E2E suite via `bun:test`.

## Quick Start
```bash
bun install 
bun dev
```

- **Server:** http://localhost:3000
- **Docs:** http://localhost:3000/scalar

## Scripts

- `bun dev` — Development server with watch mode
- `bun start` — Production server
- `bun test` — Run unit & E2E tests

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/links` | Create a shortened URL |
| `GET` | `/links` | List all shortened URLs |
| `GET` | `/links/:code/stats` | Get link click statistics |
| `DELETE` | `/links/:code` | Delete a shortened link |
| `GET` | `/:code` | Redirect to original URL (302) |

*Made with ❤️ by Quarnel*