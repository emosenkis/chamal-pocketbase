# PocketBase

Deploy a production‑ready PocketBase on Railway: pinned version, non‑root runtime, healthcheck, and volume hint for persistence.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/pocketbase-1?referralCode=asepsp&utm_medium=integration&utm_source=template&utm_campaign=generic)


## Features
- Reproducible builds via `PB_VERSION` (+ optional SHA256 verify)
- Small runtime image (multi‑stage Alpine)
- Healthcheck & `$PORT`‑aware entrypoint
- Volume hint at `/srv/pb/pb_data`
- Explicit `pb_migrations` and `pb_hooks` directories

## Current Default PocketBase Version

- `PB_VERSION=0.38.0`

This tracks the current official PocketBase release as of May 8, 2026.

## Included App Migration

This repo owns the Chamal PocketBase schema migrations in:

- `pb_migrations/`

The service starts PocketBase with:

- `--migrationsDir=/app/pb_migrations`
- `--hooksDir=/app/pb_hooks`

so migrations are applied by PocketBase at startup against the mounted data volume.
