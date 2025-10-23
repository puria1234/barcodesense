# Deploy GroSnap to Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - Select your GroSnap repository
   - Click "Import"

4. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

5. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `OPENROUTER_API_KEY` | `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` |
   | `APP_URL` | (leave empty for now, will update after deploy) |

6. **Click "Deploy"**
   - Wait for deployment to complete (usually 1-2 minutes)

7. **Update APP_URL**
   - After deployment, copy your Vercel URL (e.g., `https://grosnap.vercel.app`)
   - Go to Settings → Environment Variables
   - Update `APP_URL` with your Vercel URL
   - Redeploy (Deployments → Click ⋯ → Redeploy)

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - What's your project's name? **grosnap** (or your choice)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. **Add Environment Variables**
   ```bash
   vercel env add OPENROUTER_API_KEY
   ```
   Paste your API key when prompted
   Select: **Production, Preview, Development**

   ```bash
   vercel env add APP_URL
   ```
   Enter your Vercel URL (e.g., `https://grosnap.vercel.app`)
   Select: **Production, Preview, Development**

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Verify Deployment

1. **Visit your Vercel URL**
   - Example: `https://grosnap.vercel.app`

2. **Test the app**
   - Upload a barcode image
   - Try the AI features
   - Check browser console for errors (F12)

3. **Check Vercel Logs**
   - Go to your project in Vercel dashboard
   - Click "Deployments" → Select latest deployment
   - Click "Functions" to see API logs

---

## Troubleshooting

### AI Features Not Working

**Check Environment Variables:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `OPENROUTER_API_KEY` is set correctly
3. Verify `APP_URL` matches your Vercel URL
4. Redeploy after any changes

**Check API Endpoint:**
- Open browser console (F12)
- Try an AI feature
- Look for errors in Network tab
- API calls should go to `/api/ai`

### "API error: 401"
- Your API key is incorrect or missing
- Update `OPENROUTER_API_KEY` in Vercel environment variables
- Redeploy

### "API error: 500"
- Check Vercel function logs
- Go to Deployments → Click on deployment → Functions → View logs
- Look for error messages

### CORS Errors
- The `api/ai.js` function already handles CORS
- If you still see CORS errors, check that requests are going to `/api/ai` not `https://openrouter.ai` directly

---

## Custom Domain (Optional)

1. **Go to your project in Vercel**
2. **Click "Settings" → "Domains"**
3. **Add your custom domain**
4. **Update DNS records** as instructed by Vercel
5. **Update `APP_URL` environment variable** with your custom domain
6. **Redeploy**

---

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic production deployment
- Every push to other branches = automatic preview deployment
- Pull requests get their own preview URLs

---

## Local Testing Before Deploy

Test the Vercel serverless function locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev
```

Visit `http://localhost:3000` to test

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | `sk-or-v1-...` |
| `APP_URL` | Your deployed app URL | `https://grosnap.vercel.app` |

---

## Cost

- Vercel Free Tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless function executions
  - Custom domains
  - Automatic HTTPS

Perfect for this project! 🎉

---

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check browser console (F12)
3. Verify environment variables are set
4. Try redeploying

For Vercel-specific help: [vercel.com/docs](https://vercel.com/docs)
