# Mexen Dice Game

A mobile-friendly implementation of the popular Mexen drinking dice game.

## Features

- Add multiple players
- Roll dice with realistic animations
- Pin dice for strategic gameplay
- Track drinks and scores
- Special rules for Mex, doubles, and more

## Deployment to GitHub Pages

### Option 1: Automatic Deployment with GitHub Actions

1. Fork or clone this repository to your GitHub account
2. In your repository settings, enable GitHub Pages:
   - Go to Settings > Pages
   - Set the source to "GitHub Actions"
3. Update the `basePath` in `next.config.mjs` to match your repository name:
   ```js
   basePath: '/your-repo-name',
   \`\`\`
4. Push your changes to the main branch
5. GitHub Actions will automatically build and deploy your site
6. Once deployed, your site will be available at `https://your-username.github.io/your-repo-name/`

### Option 2: Manual Deployment

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Update the `basePath` in `next.config.mjs` to match your repository name
4. Build the project:
   \`\`\`
   npm run build
   \`\`\`
5. The static files will be generated in the `out` directory
6. Create a new branch called `gh-pages`
7. Copy the contents of the `out` directory to the root of the `gh-pages` branch
8. Push the `gh-pages` branch to GitHub
9. In your repository settings, enable GitHub Pages and set the source to the `gh-pages` branch

### Troubleshooting GitHub Actions

If you encounter issues with the GitHub Actions workflow:

1. Make sure GitHub Pages is enabled in your repository settings
2. Check that you have the correct permissions set for GitHub Actions
3. Verify that the repository is public or that you have GitHub Pages enabled for private repositories
4. Try manually deploying using Option 2 above

## Development

To run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Game Rules

- Players take turns rolling two dice
- Each player can roll a maximum of 3 times per turn
- The player with the lowest roll in a round drinks
- If Mex (1 and 2) is rolled, the number of drinks in this round doubles and the player's turn ends
- Special combinations:
  - 3-1: Player can give away a drink
  - 3-2: Player has to take a drink
- Roll values (from highest to lowest):
  - Mex (1 and 2)
  - Doubles (e.g., 6-6 = 600, 5-5 = 500, etc.)
  - Regular rolls (e.g., 6-5 = 65, 6-4 = 64)
\`\`\`

Let's also add a simple script to help with manual deployment:
