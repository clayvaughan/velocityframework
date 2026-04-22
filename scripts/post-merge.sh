#!/bin/bash
# Runs automatically after each task merge. Keep idempotent and non-interactive.
set -e

# Reinstall npm dependencies if package.json or lockfile changed.
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi
