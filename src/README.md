# WOMBTO18 NGO Platform - Frontend

A comprehensive NGO website with donation system, transparency dashboard, and donor management built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Pages
- ✅ **Home** - Hero section with organization overview
- ✅ **About Us** - Mission, vision, story, and certifications
- ✅ **Services** - Detailed program information
- ✅ **Blog** - Updates and stories from the field
- ✅ **Press** - Media coverage and press releases
- ✅ **Impact Reports** - Quarterly reports with metrics
- ✅ **Donate** - Razorpay integrated donation form
- ✅ **Donor Wall** - Public recognition with privacy options
- ✅ **Transparency** - Real-time fund tracking

### Key Functionalities
- 🔒 **Privacy-First Donor Management** - Donors choose public/anonymous display
- 📜 **Instant Tax Certificates** - Auto-generated 80G and 12A certificates
- 📊 **Real-time Transparency** - Live fund utilization tracking
- 📧 **Email Notifications** - Confirmation and progress reports
- 💳 **Razorpay Integration** - Secure payment processing
- 📱 **Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wombto18-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Backend Integration Guide

This is a **frontend-only** implementation. Follow these steps to integrate with your backend:

### 1. Replace Mock Data

All mock data is in `/data/mockData.ts`. Replace these with API calls:

```typescript
// Example: Replace this mock data
import { mockDonors } from '../data/mockData';

// With actual API call
const { data: donors } = await fetch('/api/donors').then(r => r.json());
```

### 2. Set Up Razorpay

#### Add Razorpay Script to `index.html`
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

#### Configure Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_here
```

#### Update Donate Component
In `/pages/Donate.tsx`, replace:
```typescript
key: 'YOUR_RAZORPAY_KEY_ID'
```

With:
```typescript
key: import.meta.env.VITE_RAZORPAY_KEY_ID
```

### 3. Implement Backend APIs

Refer to `/TECHNICAL_ARCHITECTURE.md` for complete API specifications. Key endpoints needed:

```
POST   /api/donations/create       # Create Razorpay order
POST   /api/donations/verify       # Verify payment
GET    /api/programs               # List programs
GET    /api/transparency/summary   # Fund data
GET    /api/donors/wall            # Donor wall data
GET    /api/certificates/:id/80g   # Download certificate
```

### 4. Connect Forms to Backend

Example for donation form:

```typescript
const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call your backend to create Razorpay order
    const response = await fetch(`${API_BASE_URL}/api/donations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: formData.amount,
            programId: formData.programId,
            donorDetails: {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                panNumber: formData.panNumber,
                isPublic: formData.isPublic
            }
        })
    });
    
    const { orderId } = await response.json();
    
    // Open Razorpay with order ID from backend
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        // ... rest of options
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
};
```

## 📋 Backend Implementation Requirements

### Database Tables Needed
1. **donors** - Store donor information
2. **programs** - Active NGO programs
3. **donations** - Transaction records
4. **progress_reports** - 7-day updates
5. **impact_reports** - Quarterly reports
6. **blog_posts** - Blog content
7. **press_releases** - Media coverage
8. **email_logs** - Email tracking

See `/TECHNICAL_ARCHITECTURE.md` for complete schema.

### Required Automations

#### 1. Certificate Generation (Immediate)
- Generate 80G certificate PDF after payment success
- Generate 12A certificate PDF after payment success
- Upload to S3/Cloudinary
- Return download URLs

#### 2. Email Notifications (Immediate)
- Send confirmation email with:
  - Transaction details
  - Certificate download links
  - Donor ID (if anonymous)

#### 3. Progress Reports (Every 7 Days)
- Cron job to check donations made 7, 14, 21... days ago
- Generate program progress content
- Email to donors
- Continue until program status = 'completed'

#### 4. Transparency Updates (Real-time)
- Update program `utilized_amount` when funds are used
- Broadcast updates via WebSocket (optional) or polling

### Security Requirements
- ✅ Verify Razorpay payment signature on backend
- ✅ Encrypt sensitive data (PAN numbers)
- ✅ Implement rate limiting on donation APIs
- ✅ Use HTTPS for all API calls
- ✅ Validate all user inputs
- ✅ Implement CORS properly

## 🎨 Customization

### Update Organization Info

Edit these files:
- `/components/Footer.tsx` - Contact details, address
- `/pages/About.tsx` - Mission, vision, story, milestones
- `/pages/Services.tsx` - Programs and services

### Change Colors

Default theme uses rose-600 (#e11d48). To change:

1. Global search and replace `rose-600` with your color
2. Update gradient classes in `/pages/*.tsx`

### Add New Pages

1. Create page component in `/pages/`
2. Add route to `/routes.tsx`
3. Add link to `/components/Header.tsx`

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **GitHub Pages**

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔌 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.wombto18.org

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## 🤝 Integration with Razorpay

### Payment Flow

1. **User fills donation form** → Click "Proceed to Payment"
2. **Frontend calls your backend** → `POST /api/donations/create`
3. **Backend creates Razorpay order** → Returns `order_id`
4. **Frontend opens Razorpay checkout** → User completes payment
5. **Razorpay calls success handler** → `handler()` function
6. **Frontend sends payment details to backend** → `POST /api/donations/verify`
7. **Backend verifies signature** → Updates database
8. **Backend triggers automations**:
   - Generate certificates
   - Send confirmation email
   - Schedule progress reports
9. **Frontend shows success screen** → Certificates available for download

### Webhook Setup (Important!)

Configure Razorpay webhook in dashboard:
- Webhook URL: `https://your-backend.com/api/webhooks/razorpay`
- Events: `payment.captured`, `payment.failed`

This ensures you capture payments even if user closes browser.

## 📖 Documentation

- **Technical Architecture**: `/TECHNICAL_ARCHITECTURE.md`
- **API Specifications**: `/TECHNICAL_ARCHITECTURE.md#api-endpoints`
- **Database Schema**: `/TECHNICAL_ARCHITECTURE.md#database-structure`
- **Automation Workflows**: `/TECHNICAL_ARCHITECTURE.md#automation-workflows`

## 🧪 Testing Backend Integration

Use these test data:

```javascript
// Test Razorpay in test mode
Key ID: rzp_test_xxxxxxxxx

// Test card numbers (Razorpay test mode)
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

## 🚨 Important Notes

1. **This is frontend only** - You must implement backend as per architecture doc
2. **Replace all mock data** - Mock data in `/data/mockData.ts` is for demo only
3. **Add Razorpay script** - Include script in your HTML
4. **Certificate generation** - Implement PDF generation in backend
5. **Email automation** - Set up SendGrid/AWS SES
6. **Cron jobs** - Implement 7-day report scheduler
7. **Security** - Always verify payments on backend

## 📞 Support

For questions about:
- **Frontend**: Modify components in `/pages/` and `/components/`
- **Backend**: Refer to `/TECHNICAL_ARCHITECTURE.md`
- **Razorpay**: https://razorpay.com/docs/

## 📄 License

MIT License - Feel free to use for your NGO

## 🎯 Next Steps

1. ✅ Review the frontend (you're here!)
2. ⬜ Read `/TECHNICAL_ARCHITECTURE.md`
3. ⬜ Set up backend server
4. ⬜ Create database with provided schema
5. ⬜ Implement API endpoints
6. ⬜ Configure Razorpay account
7. ⬜ Set up email service
8. ⬜ Implement automation workflows
9. ⬜ Connect frontend to backend APIs
10. ⬜ Test end-to-end
11. ⬜ Deploy to production

---

**Built with ❤️ for WOMBTO18**

*Making a difference through transparency and technology*
