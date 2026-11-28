#!/usr/bin/env bash
# clear.sh — Vue + Vite projects (app, vite-ssg app or library)
# Removes everything the project generates locally (nothing tracked by git): the Vite build output,
# the vite-ssg temp folder, the Netlify output, node_modules, the test coverage, the TypeScript
# build info, the lint cache, the bundle report, the logs and the macOS .DS_Store files,
# then cleans the npm cache.
# Never touches .env or the Impeccable design context.
# Run 'npm run si' afterwards to reinstall the dependencies.

set -e

cd "$(dirname "$0")/.."

# dist, dist-ssr: Vite build output (app or library, SSR build)
# .vite-ssg-temp: vite-ssg prerender temp folder
# .cache: build caches
# .netlify: Netlify CLI output
# node_modules: dependencies (also holds the Vite and Vitest caches)
# coverage: Vitest coverage report
# logs: log folder
for dir in dist dist-ssr .vite-ssg-temp .cache .netlify node_modules coverage logs; do
  if [[ -e "$dir" ]]; then
    echo "🗑️  Removing '$dir'..."
    rm -rf "$dir"
  fi
done

echo "🗑️  Removing the TypeScript build info, lint cache, bundle report, log files and .DS_Store..."
rm -f .eslintcache stats.html
find . -path ./.git -prune -o -path ./node_modules -prune -o -type f -name '*.tsbuildinfo' -print -delete
find . -maxdepth 1 -type f -name '*.log' -delete
find . -path ./.git -prune -o -type f -name '.DS_Store' -print -delete

echo "🧹 Cleaning the npm cache..."
npm cache clean --force

echo "✅ Done — run 'npm run si' to reinstall the dependencies."
