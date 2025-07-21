#!/bin/bash

echo "Exporting Ryan's Sports Challenge 2026 to GitHub..."
echo "Repository: https://github.com/fjmurias/sling.git"
echo ""

# Remove lock files
rm -f .git/config.lock .git/index.lock 2>/dev/null

# Set git config
git config user.email "fjmurias@example.com"
git config user.name "fjmurias"

# Remove existing remote and add new one
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/fjmurias/sling.git

# Add all files and commit
git add .
git commit -m "Ryan's Sports Challenge 2026 - Multi-sport fantasy league platform with real data integration"

# Push to GitHub
git push -u origin main

echo ""
echo "✓ Successfully exported to GitHub!"
echo "View your repository at: https://github.com/fjmurias/sling"