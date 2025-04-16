// Simple script to help with manual deployment to GitHub Pages
const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

// Get repository name from package.json or prompt user
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const repoName = packageJson.name || "mexen-game"

console.log(`Deploying to GitHub Pages for repository: ${repoName}`)

// Update basePath in next.config.mjs
let nextConfig = fs.readFileSync("next.config.mjs", "utf8")
nextConfig = nextConfig.replace(/basePath: ['"].*['"]/, `basePath: '/${repoName}'`)
fs.writeFileSync("next.config.mjs", nextConfig)

console.log("Updated basePath in next.config.mjs")

// Build the project
console.log("Building project...")
execSync("npm run build", { stdio: "inherit" })

console.log("Build complete!")
console.log(`
To deploy manually:
1. Create a new branch: git checkout -b gh-pages
2. Copy the contents of the 'out' directory to the root
3. Add and commit the files
4. Push to GitHub: git push origin gh-pages
5. Enable GitHub Pages in your repository settings
`)
