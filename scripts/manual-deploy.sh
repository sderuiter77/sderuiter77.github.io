#!/bin/bash

# This script helps with manual deployment to GitHub Pages

# Get repository name
REPO_NAME=$(basename -s .git `git config --get remote.origin.url`)
echo "Repository name: $REPO_NAME"

# Update basePath in next.config.mjs
sed -i "s|basePath: '.*'|basePath: '/$REPO_NAME'|" next.config.mjs
echo "Updated basePath in next.config.mjs"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building project..."
npm run build

# Create a temporary directory for deployment
echo "Creating temporary directory for deployment..."
mkdir -p temp_deploy

# Copy the contents of the out directory to the temporary directory
echo "Copying build files..."
cp -r out/* temp_deploy/

# Create a .nojekyll file to prevent GitHub Pages from using Jekyll
touch temp_deploy/.nojekyll

echo "
Manual deployment files are ready in the temp_deploy directory.

To deploy:
1. Create a new branch: git checkout -b gh-pages
2. Remove all files except .git: git rm -rf .
3. Copy all files from temp_deploy: cp -r temp_deploy/* .
4. Add all files: git add .
5. Commit: git commit -m 'Deploy to GitHub Pages'
6. Push: git push -f origin gh-pages
7. In GitHub repository settings, ensure GitHub Pages is set to deploy from the gh-pages branch
"
