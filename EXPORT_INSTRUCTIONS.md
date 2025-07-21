# How to Export Your Code to GitHub

## Method 1: Copy and Paste (Simplest)

1. Go to https://github.com/fjmurias/sling
2. Click "Create repository" if it doesn't exist yet
3. Click "uploading an existing file" or "Add file" → "Upload files"
4. Copy each file from Replit and paste into GitHub:

### Key Files to Copy:
- `README.md` (I created this - has full documentation)
- `package.json` 
- `client/` folder (entire React frontend)
- `server/` folder (entire Express backend)  
- `shared/` folder (database schemas)
- `attached_assets/` folder (CSV data files)
- `.gitignore` (I created this)
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `drizzle.config.ts`

## Method 2: Download and Upload

1. In Replit, look for:
   - Three dots menu (⋯) → "Download as zip"
   - Or File menu → "Download" 
   - Or right-click on project name

2. Extract the zip file on your computer

3. Go to GitHub.com and upload the extracted files

## Method 3: Find the Shell/Terminal

Look for these in your Replit interface:
- Bottom panel: tabs labeled "Console", "Shell", "Terminal"
- Left sidebar: terminal icon (looks like >_)
- Top menu: "Tools" → "Shell"

Then run:
```bash
git remote add origin https://github.com/fjmurias/sling.git
git push -u origin main
```

## What You're Uploading

This is a complete multi-sport fantasy league platform with:
- Real data from Ryan's Sports Challenge 2026
- Dashboard with player-specific stats
- Leaderboard with authentic CSV data
- Full React/TypeScript frontend
- Express.js/PostgreSQL backend
- Professional README and documentation

Your 6+ hours of work is ready to showcase!