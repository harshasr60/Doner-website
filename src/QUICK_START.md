# ⚡ WOMBTO18 - Quick Start Guide

## 🎯 What You Have

✅ **Complete Frontend** (React + TypeScript + Tailwind)  
✅ **9 Fully Functional Pages**  
✅ **Razorpay Integration Ready**  
✅ **Complete Documentation**  
✅ **Database Schema**  
✅ **Architecture Diagrams**

---

## 🚀 Get Started in 5 Minutes

### 1. Run the Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:5173`

### 2. Explore the Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with hero section |
| About | `/about` | Mission, vision, story |
| Services | `/services` | Programs offered |
| Blog | `/blog` | Articles and stories |
| Press | `/press` | Media coverage |
| Impact | `/impact-reports` | Quarterly reports |
| **Donate** | `/donate` | **Payment integration** |
| Donor Wall | `/donor-wall` | Public recognition |
| Transparency | `/transparency` | Fund tracking |

### 3. Check the Demo Features

#### Try the Donation Form
1. Go to `/donate`
2. Fill the form
3. Click "Proceed to Payment"
4. See the Razorpay integration points

#### View Transparency Dashboard
1. Go to `/transparency`
2. See fund tracking visualization
3. Program-wise breakdown

#### Check Donor Wall
1. Go to `/donor-wall`
2. See public vs anonymous donors
3. Tiered recognition system

---

## 📚 Documentation Guide

### Start Here: 📖 README.md
- **What**: Quick overview and setup
- **When**: First thing to read
- **Time**: 5 minutes

### Deep Dive: 🏗️ TECHNICAL_ARCHITECTURE.md
- **What**: Complete system design
- **When**: Before building backend
- **Time**: 30 minutes
- **Contains**:
  - Database schema (detailed)
  - API endpoints (18 endpoints)
  - Automation workflows
  - Security guidelines

### Implementation: ✅ INTEGRATION_CHECKLIST.md
- **What**: Step-by-step guide
- **When**: During backend development
- **Time**: Follow over 2-3 weeks
- **Contains**:
  - Phase-by-phase tasks
  - Testing instructions
  - Go-live checklist

### Payment Setup: 💳 RAZORPAY_INTEGRATION.md
- **What**: Razorpay integration guide
- **When**: Setting up payments (Day 3-4)
- **Time**: 1 day implementation
- **Contains**:
  - Account setup
  - Code examples
  - Testing guide
  - Troubleshooting

### Visual Guide: 📊 DATA_FLOW_DIAGRAM.md
- **What**: System flow diagrams
- **When**: Understanding architecture
- **Time**: 15 minutes
- **Contains**:
  - End-to-end flows
  - Database relationships
  - Timeline diagrams

### Summary: 📝 PROJECT_SUMMARY.md
- **What**: High-level overview
- **When**: Quick reference
- **Time**: 10 minutes

---

## 🔧 What You Need to Build

### Backend (Estimated: 15-20 days)

#### Week 1: Core Setup
- [ ] Set up Node.js/Express server
- [ ] Create PostgreSQL database (use `/database-schema.sql`)
- [ ] Implement donor and program models
- [ ] Create basic API endpoints

#### Week 2: Payment Integration
- [ ] Set up Razorpay account
- [ ] Implement payment creation
- [ ] Implement payment verification
- [ ] Set up webhooks

#### Week 3: Automation & Features
- [ ] Certificate generation (PDF)
- [ ] Email system (SendGrid/SES)
- [ ] 7-day progress reports (cron)
- [ ] Admin dashboard

---

## 📋 Essential Backend APIs

### Priority 1 (Must Have for Launch)
```
POST /api/donations/create       # Create Razorpay order
POST /api/donations/verify       # Verify payment
GET  /api/programs               # List programs
GET  /api/transparency/summary   # Fund tracking data
```

### Priority 2 (Important)
```
GET  /api/donors/wall            # Donor wall data
GET  /api/certificates/80g/:id   # Download 80G cert
GET  /api/certificates/12a/:id   # Download 12A cert
POST /api/certificates/generate  # Generate certificates
```

### Priority 3 (Can Add Later)
```
GET  /api/blog                   # Blog posts
GET  /api/press                  # Press releases
GET  /api/impact-reports         # Impact reports
GET  /api/progress/:donorId      # Progress reports
```

---

## 🎨 Customization Checklist

### Before Launch - Update These:

#### 1. Organization Info
- [ ] `/components/Footer.tsx` - Contact details, address
- [ ] `/pages/About.tsx` - Mission, vision, story
- [ ] `/pages/Services.tsx` - Your actual programs

#### 2. Content
- [ ] Replace lorem ipsum with real content
- [ ] Add organization logo
- [ ] Update social media links
- [ ] Add real images (or use Unsplash)

#### 3. Colors (Optional)
- [ ] Global search `rose-600` to change primary color
- [ ] Update gradient classes if needed

---

## 💳 Razorpay Setup (Critical!)

### Test Mode (Development)
```bash
# 1. Sign up at razorpay.com
# 2. Get test keys
# 3. Add to .env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# 4. Add script to index.html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

# 5. Update /pages/Donate.tsx line 60
key: import.meta.env.VITE_RAZORPAY_KEY_ID
```

### Live Mode (Production)
```bash
# 1. Complete KYC on Razorpay
# 2. Get live keys
# 3. Update .env.production
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# 4. Configure webhook
https://your-backend.com/api/webhooks/razorpay
```

---

## 🔗 Connect Frontend to Backend

### Create API Service

Create `/src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Programs
  getPrograms: () => 
    fetch(`${API_URL}/api/programs`).then(r => r.json()),

  // Donations
  createDonation: (data: any) =>
    fetch(`${API_URL}/api/donations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Transparency
  getTransparency: () =>
    fetch(`${API_URL}/api/transparency/summary`).then(r => r.json()),
};
```

### Replace Mock Data

```typescript
// Before (mock data)
import { mockPrograms } from '../data/mockData';

// After (real API)
const [programs, setPrograms] = useState([]);

useEffect(() => {
  api.getPrograms().then(setPrograms);
}, []);
```

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] All pages load without errors
- [ ] Navigation works
- [ ] Forms validate properly
- [ ] Mobile responsive
- [ ] Works on Chrome, Firefox, Safari

### Payment Testing (Test Mode)
- [ ] Form submission works
- [ ] Razorpay checkout opens
- [ ] Test card: 4111 1111 1111 1111
- [ ] Payment success flow
- [ ] Payment failure flow
- [ ] Success page displays

### Backend Testing
- [ ] API endpoints return data
- [ ] Payment verification works
- [ ] Database updates correctly
- [ ] Certificates generate
- [ ] Emails send

---

## 🚨 Common Issues & Fixes

### Issue: "Razorpay is not defined"
**Fix**: Add script to `index.html` before your app loads

### Issue: Payment signature verification fails
**Fix**: Check RAZORPAY_KEY_SECRET is correct on backend

### Issue: CORS errors
**Fix**: Enable CORS on backend with proper origin

### Issue: Mock data still showing
**Fix**: Replace imports from `/data/mockData.ts` with API calls

---

## 📊 Success Metrics

### Day 1
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Test donation successful
- [ ] Email received

### Week 1
- [ ] 10+ test donations
- [ ] All certificates generating
- [ ] No critical bugs

### Month 1
- [ ] 100+ real donations
- [ ] Progress reports sending
- [ ] Donor wall populated
- [ ] Positive feedback

---

## 🎯 Launch Checklist

### Technical
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Backend deployed to AWS/Heroku
- [ ] Database on AWS RDS
- [ ] SSL certificates configured
- [ ] Domain pointed correctly
- [ ] Razorpay in live mode
- [ ] Email service configured
- [ ] Monitoring set up

### Content
- [ ] All content updated
- [ ] Images replaced
- [ ] Contact info correct
- [ ] Social links working
- [ ] Legal pages added

### Testing
- [ ] End-to-end test passed
- [ ] Payment flow tested
- [ ] Emails received
- [ ] Certificates downloaded
- [ ] Mobile tested
- [ ] Multiple browsers tested

### Compliance
- [ ] 80G certificate valid
- [ ] 12A registration current
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Refund policy defined

---

## 🆘 Need Help?

### Documentation
1. **Start**: README.md
2. **Architecture**: TECHNICAL_ARCHITECTURE.md
3. **Implementation**: INTEGRATION_CHECKLIST.md
4. **Payments**: RAZORPAY_INTEGRATION.md
5. **Diagrams**: DATA_FLOW_DIAGRAM.md

### Razorpay Support
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs
- Email: support@razorpay.com

### Database
- Schema: `/database-schema.sql`
- Run it in PostgreSQL
- Creates all 8 tables + indexes + views

---

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
psql -U postgres -d wombto18_db -f database-schema.sql

# Deployment
vercel --prod           # Deploy to Vercel
netlify deploy --prod   # Deploy to Netlify
```

---

## 🎉 You're Ready!

**What you have:**
- ✅ Complete frontend
- ✅ Razorpay integration ready
- ✅ Full documentation
- ✅ Database schema
- ✅ Architecture designed

**What's next:**
1. Build backend (15-20 days)
2. Connect to frontend
3. Test thoroughly
4. Launch! 🚀

---

## 📞 Quick Reference

| What | Where | Time |
|------|-------|------|
| Run frontend | `npm run dev` | 1 min |
| Read docs | README.md | 5 min |
| Understand system | TECHNICAL_ARCHITECTURE.md | 30 min |
| Implement backend | INTEGRATION_CHECKLIST.md | 15-20 days |
| Set up payments | RAZORPAY_INTEGRATION.md | 1 day |
| See diagrams | DATA_FLOW_DIAGRAM.md | 15 min |

---

**Built for WOMBTO18**  
*Transparency through technology*

**Last Updated**: February 12, 2026  
**Version**: 1.0  
**Status**: Frontend Complete ✅
