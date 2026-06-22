#!/bin/sh
set -e

# Run database migrations / push schema
npx prisma db push --skip-generate 2>/dev/null || true

# Seed database if empty (first run)
npx prisma db seed 2>/dev/null || true

exec "$@"
