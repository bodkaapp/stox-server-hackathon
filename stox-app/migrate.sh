#!/bin/sh
set -e

echo "Starting database migration..."
export MIGRATIONS_FOLDER="./drizzle"
node migrate.cjs
echo "Migration finished successfully."
