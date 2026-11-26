# zhangruopan-site

Recovered deployment package for Zhangruopan's personal portfolio.

## Deploy on Vercel

1. Create a new GitHub repository and push all files in this folder to its `main` branch.
2. In the new Vercel account, choose **Add New → Project** and import that repository.
3. Keep the framework preset as **Other** and the root directory as `./`; no build command is required.
4. Deploy and verify the generated `vercel.app` preview URL.
5. Add `zhangruopan.com` and `www.zhangruopan.com` under **Project → Settings → Domains**.
6. Update DNS only after the preview has been verified.

The portfolio works as a static site. The chat widget falls back to its built-in local answers when `/api/chat` is not configured.
