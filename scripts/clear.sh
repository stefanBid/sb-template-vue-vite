#!/usr/bin/env bash
# clear.sh
# Removes the Vite build outputs, the coverage report, the Netlify output and node_modules, then cleans the npm cache.
# Run 'npm run si' afterwards to reinstall the dependencies.

set -e

cd "$(dirname "$0")/.."

for dir in dist dist-ssr coverage .netlify node_modules; do
  if [[ -e "$dir" ]]; then
    echo "🗑️  Removing '$dir'..."
    rm -rf "$dir"
  fi
done

echo "🧹 Cleaning the npm cache..."
npm cache clean --force

echo "✅ Done — run 'npm run si' to reinstall the dependencies."
