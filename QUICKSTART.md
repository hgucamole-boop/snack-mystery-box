# 🚀 QUICK START GUIDE

Get your Snack Mystery Box website live in 5 minutes!

## ⚡ Fastest Path to Deployment

### 1️⃣ Add Your Google Analytics ID (1 minute)

Open `app/page.jsx` and edit line 7:
```javascript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← Replace with your GA4 ID
```

**Don't have GA4 yet?** You can deploy first and add it later. The site works without it.

**Get GA4 ID:**
1. Go to analytics.google.com
2. Admin → Create Property
3. Add Data Stream → Web
4. Copy the Measurement ID (G-XXXXXXXXXX)

### 2️⃣ Deploy to Vercel (3 minutes)

**Option A: Deploy with GitHub (Recommended)**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
# (Create a repo on GitHub first, then:)
git remote add origin https://github.com/yourusername/snack-mystery-box.git
git push -u origin main

# Then on Vercel:
# 1. Go to vercel.com/new
# 2. Import your GitHub repo
# 3. Click Deploy (Vercel auto-detects Next.js)
```

**Option B: Deploy with Vercel CLI**
```bash
npm i -g vercel
vercel

# For production:
vercel --prod
```

### 3️⃣ Test Your Site (1 minute)

1. Visit your Vercel URL (e.g., https://snack-mystery-box.vercel.app)
2. Check Google Analytics Realtime reports
3. Test the subscription form
4. Click around and watch events in GA4

## ✅ You're Live!

Your site is now deployed and tracking analytics!

## 🎯 Next Steps (Optional)

### Connect a Custom Domain
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., snackmysterybox.com)
3. Follow DNS instructions (usually add a CNAME record)

### Set Up Real Backend
Right now the form just shows an alert. To handle real signups:

1. **Add a backend API** (e.g., `/app/api/subscribe/route.js`):
```javascript
export async function POST(req) {
  const { email, plan } = await req.json();
  
  // Add to your database
  // Send to email service (Mailchimp, etc.)
  // Process with payment gateway
  
  return Response.json({ success: true });
}
```

2. **Update the form handler** in `app/page.jsx` (line 28):
```javascript
const response = await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify({ email, plan: selectedPlan })
});
```

### Recommended Services
- **Email**: Mailchimp, SendGrid, ConvertKit
- **Payments**: Stripe, PayPal
- **Database**: Vercel Postgres, Supabase, MongoDB Atlas
- **CMS**: Sanity, Contentful (if you want to manage content easily)

## 🎨 Customization Quick Reference

All customization is in `app/page.jsx`:

- **Colors**: Line 120-127 (CSS variables)
- **Plans & Pricing**: Line 46-57
- **Features**: Line 58-65
- **Text Content**: Lines 183-192 (hero), 255+ (sections)

## 📊 Understanding Your Analytics

After deployment, you'll see these events in GA4:

| Event Name | When It Fires | Data Captured |
|------------|---------------|---------------|
| `page_view` | Page loads | Automatic |
| `cta_click` | Hero button clicked | location: 'hero' |
| `plan_selected` | Plan card clicked | plan: 'weekly/biweekly/monthly' |
| `subscription_signup` | Form submitted | plan, email |

View in GA4: Reports → Engagement → Events

## ❓ Common Issues

**"Module not found" error**
```bash
npm install
```

**GA4 not tracking**
- Wait 24-48 hours for initial data
- Check Measurement ID is correct
- Disable ad blockers when testing
- Use Incognito/Private browsing

**Vercel build fails**
- Check Node.js version (needs 18+)
- Review build logs in Vercel dashboard
- Ensure all files are committed to git

## 💡 Pro Tips

1. **Test locally first**: Run `npm run dev` before deploying
2. **Use environment variables**: Store GA ID in Vercel env vars for security
3. **Enable Preview Deployments**: Every git push creates a preview URL on Vercel
4. **Monitor Core Web Vitals**: Vercel provides automatic performance monitoring

---

**Need help?** Check the full README.md for detailed documentation.

🎉 **Happy launching!**
