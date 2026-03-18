---
description: how to deploy the application to GitHub Pages
---

This workflow describes the process for deploying the LinkedInPreview application to GitHub Pages as a static site.

### Prerequisites

1.  Make sure `next.config.mjs` has `output: 'export'` and `images.unoptimized: true` enabled.
2.  Ensure that `.github/workflows/deploy.yml` is present in the repository.

### Steps

// turbo
1.  **Verify the build works locally**
    Run `npm run build` to ensure the static export (stored in `/out`) is generated successfully without errors.

// turbo
2.  **Run Linting**
    Run `npm run lint` to catch any potential issues before pushing to GitHub.

// turbo
3.  **Commit and Push to GitHub**
    Once verified, commit the changes and push to the `main` branch.
    ```bash
    git add .
    git commit -m "chore: setup deployment to GitHub Pages"
    git push origin main
    ```

4.  **Enable GitHub Pages in Repo Settings**
    Go to the repository on GitHub: `Settings` > `Pages`.
    Under `Build and deployment` > `Source`, select `GitHub Actions`.

5.  **Monitor Deployment**
    Check the `Actions` tab on your repository to see the deployment progress.
    Once finished, the site will be live at `https://[username].github.io/[repo-name]/`.

### Notes
- If the project is NOT at the root of the domain (e.g., `github.io/project-name`), you might need to add `basePath: '/project-name'` to your `next.config.mjs`.
