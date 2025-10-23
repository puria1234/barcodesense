# 🚀 Deploy GroSnap to Vercel - Simple Steps

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Go to [vercel.com](https://vercel.com)

1. **Sign in with GitHub**

2. **Click "Add New..." → "Project"**

3. **Import your repository**
   - Find your GroSnap repository
   - Click "Import"

4. **Configure the project:**
   - Project Name: `grosnap` (or whatever you want)
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add this:
     ```
     Name: OPENROUTER_API_KEY
     Value: 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
     ```
   - Select: Production, Preview, and Development

6. **Click "Deploy"**
   - Wait 1-2 minutes for deployment

7. **Done!** 🎉
   - Click "Visit" to see your live app
   - Your URL will be something like: `https://grosnap.vercel.app`

---

## Step 3: Test Your App

1. Visit your Vercel URL
2. Upload a barcode image
3. Try the AI features:
   - Healthier Alternatives
   - Mood-Based Recommendations
   - Diet Compatibility
   - Eco Score

---

## Troubleshooting

### AI Features Not Working?

1. **Check Environment Variable:**
   - Go to Vercel Dashboard
   - Click your project
   - Settings → Environment Variables
   - Make sure `OPENROUTER_API_KEY` is there

2. **Check Browser Console:**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Redeploy:**
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"

### Still Not Working?

Check the function logs:
1. Go to your project in Vercel
2. Click "Deployments"
3. Click on the latest deployment
4. Click "Functions"
5. Look for `/api/ai` and check logs

---

## Update Your App

Every time you push to GitHub, Vercel automatically deploys:

```bash
git add .
git commit -m "Your update message"
git push
```

Wait 1-2 minutes and your changes are live! ✨

---

## Custom Domain (Optional)

1. Go to your project in Vercel
2. Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Done!

---

## That's It!

Your app is now live and secure:
- ✅ API key is hidden on the server
- ✅ Automatic deployments from GitHub
- ✅ Free hosting with HTTPS
- ✅ Global CDN for fast loading

Enjoy! 🎉
