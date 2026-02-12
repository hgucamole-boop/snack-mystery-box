# 📦 Snack Mystery Box - Subscription Website

A bold, energetic landing page for a weekly blind box snack subscription service. Built with Next.js 14 and ready for Vercel deployment with Google Analytics integration.

## 🚀 Features

- **Bold, Playful Design** - Eye-catching aesthetics with unique typography and animations
- **Google Analytics Integration** - Track user interactions, signups, and plan selections
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Zero-Config Deployment** - Deploy to Vercel with one click
- **Performance Optimized** - Built with Next.js 14 for optimal loading speeds

## 📋 Prerequisites

- Node.js 18+ installed
- A Google Analytics 4 property (for tracking)
- Vercel account (for deployment)

## 🛠️ Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Google Analytics**
   - Open `app/page.jsx`
   - Find line 7: `const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';`
   - Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
   - You can find this in your Google Analytics Admin > Data Streams > Choose your stream > Measurement ID

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site

4. **Build for Production** (optional - Vercel handles this automatically)
   ```bash
   npm run build
   npm start
   ```

## 📊 Setting Up Google Analytics 4

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Fill in property details:
   - Property name: "Snack Mystery Box"
   - Timezone and currency
5. Click "Next" and complete setup

### Step 2: Create Web Data Stream

1. In your new property, go to "Data Streams"
2. Click "Add stream" > "Web"
3. Enter your website URL (or localhost for testing)
4. Name the stream (e.g., "Main Website")
5. Click "Create stream"
6. **Copy the Measurement ID** (format: G-XXXXXXXXXX)

### Step 3: Add Measurement ID to Code

1. Open `app/page.jsx`
2. Replace the placeholder on line 7:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID-HERE';
   ```

### Step 4: Verify Tracking

1. Run your site locally or deploy to Vercel
2. In Google Analytics, go to Reports > Realtime
3. Visit your website
4. You should see your session appear in the Realtime report

## 🎯 What Gets Tracked

The website automatically tracks:

- **Page Views** - Every time someone visits the page
- **CTA Clicks** - When users click "Start Exploring" button
- **Plan Selections** - Which subscription plan users select
- **Subscription Signups** - When users submit the email form (includes selected plan and email)

### Custom Events

All events can be viewed in Google Analytics under:
Reports > Engagement > Events

Event names:
- `cta_click` - Hero button clicks
- `plan_selected` - Plan card selections
- `subscription_signup` - Email form submissions

## 🚀 Deploying to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to link/create your Vercel project

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Configure Domain** (optional)
   - In Vercel project settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

## 📁 Project Structure

```
snack-mystery-box/
├── app/
│   ├── layout.jsx          # Root layout with metadata
│   └── page.jsx            # Main landing page with GA integration
├── .gitignore
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── README.md
```

## 🎨 Customization

### Updating Content

Edit `app/page.jsx` to customize:
- **Hero Text** - Lines 183-192
- **Features** - Lines 58-65 (features array)
- **Pricing Plans** - Lines 46-57 (plans array)
- **Colors** - Lines 120-127 (CSS variables in :root)

### Changing Typography

The site uses:
- **Display**: Bebas Neue (headers)
- **Bold**: Archivo Black (hero title)
- **Body**: Space Mono (content)

To change fonts, update the Google Fonts import on line 107.

### Color Scheme

Current theme (line 120-127):
```css
--primary: #FF2E63;    /* Vibrant pink */
--secondary: #FFD700;   /* Gold */
--dark: #1A1A2E;       /* Deep blue-black */
--light: #FFF5E1;      /* Cream */
--accent: #00D9FF;     /* Cyan */
--green: #7FFF00;      /* Bright green */
```

## 🔧 Environment Variables (Optional)

For more secure GA configuration, you can use environment variables:

1. Create `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Update `app/page.jsx` line 7:
   ```javascript
   const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
   ```

3. In Vercel Dashboard > Project Settings > Environment Variables, add:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: Your GA Measurement ID

## 📝 Next Steps

1. **Connect Real Backend**
   - Replace the `handleSubmit` function (line 25) with actual API calls
   - Set up a database to store subscriptions
   - Integrate payment processing (Stripe, PayPal, etc.)

2. **Add More Pages**
   - Create `app/about/page.jsx` for About page
   - Create `app/faq/page.jsx` for FAQ
   - Create `app/contact/page.jsx` for Contact

3. **Enhanced Analytics**
   - Set up conversion tracking
   - Create custom dashboards in GA4
   - Set up e-commerce tracking for actual purchases

4. **Email Integration**
   - Connect to email service (Mailchimp, SendGrid, etc.)
   - Send welcome emails to new subscribers
   - Set up automated sequences

## 🐛 Troubleshooting

**Google Analytics not tracking:**
- Check browser console for errors
- Verify Measurement ID is correct
- Check if ad blockers are interfering
- Wait 24-48 hours for data to populate in GA4 reports

**Build errors on Vercel:**
- Ensure all dependencies are in package.json
- Check that Node.js version is 18+
- Review Vercel build logs for specific errors

**Styling issues:**
- Clear browser cache
- Check that all Google Fonts are loading
- Verify no CSS conflicts with browser extensions

## 📄 License

This project is open source and available for modification.

## 🙋 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Review [Vercel Documentation](https://vercel.com/docs)
4. Review [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)

---

**Built with ❤️ using Next.js 14 and deployed on Vercel**
