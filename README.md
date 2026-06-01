# The Privilege Walk Quiz

A privilege walk quiz for artists — 26 questions about class, race, gender, money and time, guided by a historical figure from your field.

## Deploy in 5 minutes

### Option A — Vercel (recommended, free)
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → select your repository
4. Leave all settings as default → click **Deploy**
5. Done. Vercel gives you a live URL instantly.

### Option B — Netlify (also free)
1. Push this folder to a GitHub repository
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repository
4. Set **Build command**: `npm run build`
5. Set **Publish directory**: `dist`
6. Click **Deploy site**

## Local development
```bash
npm install
npm run dev
```
Then open http://localhost:5173

## Notes
- Scores are stored in the visitor's browser (localStorage)
- The CSV export downloads all results stored in the current browser
- No backend or database required
