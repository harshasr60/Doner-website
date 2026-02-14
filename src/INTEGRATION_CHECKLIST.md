# Backend Integration Checklist for WOMBTO18

## 🎯 Quick Reference Guide

This checklist helps you integrate the frontend with your backend step by step.

---

## ✅ Phase 1: Initial Setup (Day 1)

### Backend Server Setup
- [ ] Choose backend framework (Node.js/Express recommended)
- [ ] Initialize project with TypeScript
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Install required packages:
  ```bash
  npm install express pg razorpay nodemailer pdfkit cors dotenv
  npm install -D typescript @types/node @types/express
  ```

### Database Setup
- [ ] Create PostgreSQL database: `wombto18_db`
- [ ] Run migrations for all tables (see TECHNICAL_ARCHITECTURE.md)
- [ ] Create database indexes
- [ ] Set up connection pool
- [ ] Test database connectivity

---

## ✅ Phase 2: Razorpay Configuration (Day 2)

### Razorpay Account
- [ ] Sign up at https://razorpay.com
- [ ] Complete KYC verification
- [ ] Get Test API credentials (Key ID & Secret)
- [ ] Get Live API credentials (after testing)
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Enable required payment methods

### Backend Razorpay Integration
- [ ] Install Razorpay SDK: `npm install razorpay`
- [ ] Create Razorpay instance with credentials
- [ ] Implement order creation endpoint: `POST /api/donations/create`
- [ ] Implement payment verification endpoint: `POST /api/donations/verify`
- [ ] Implement signature verification function
- [ ] Implement webhook handler: `POST /api/webhooks/razorpay`
- [ ] Test with Razorpay test cards

### Frontend Razorpay Connection
- [ ] Add Razorpay script to `index.html`:
  ```html
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  ```
- [ ] Create `.env` file with: `VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx`
- [ ] Update `/pages/Donate.tsx` line 60 with your key
- [ ] Replace mock payment handler with real API calls
- [ ] Test end-to-end payment flow

---

## ✅ Phase 3: Certificate Generation (Day 3-4)

### PDF Generation Setup
- [ ] Install PDF library: `npm install pdfkit`
- [ ] Design 80G certificate template
- [ ] Design 12A certificate template
- [ ] Add organization logo and signature
- [ ] Implement PDF generation functions

### File Storage Setup
- [ ] Choose storage (AWS S3 recommended)
- [ ] Create S3 bucket: `wombto18-certificates`
- [ ] Configure bucket permissions (private)
- [ ] Install AWS SDK: `npm install @aws-sdk/client-s3`
- [ ] Implement upload function
- [ ] Generate signed URLs for downloads

### Certificate Endpoints
- [ ] `POST /api/certificates/generate` - Generate both certificates
- [ ] `GET /api/certificates/80g/:donationId` - Download 80G
- [ ] `GET /api/certificates/12a/:donationId` - Download 12A
- [ ] Update donation record with certificate URLs
- [ ] Test certificate generation and download

---

## ✅ Phase 4: Email System (Day 5-6)

### Email Service Setup
- [ ] Choose email service (SendGrid recommended)
- [ ] Sign up and verify domain
- [ ] Get API key
- [ ] Install package: `npm install @sendgrid/mail`
- [ ] Configure email service in backend

### Email Templates
- [ ] Create donation confirmation template
- [ ] Create progress report template
- [ ] Create final report template
- [ ] Create admin notification template
- [ ] Add brand styling to templates

### Email Endpoints & Functions
- [ ] Implement `sendConfirmationEmail(donation)`
- [ ] Implement `sendProgressReport(donation)`
- [ ] Implement `sendFinalReport(donation)`
- [ ] Implement email logging to database
- [ ] Test all email templates

---

## ✅ Phase 5: Core API Endpoints (Day 7-8)

### Donor APIs
- [ ] `POST /api/donors/create` - Create new donor
- [ ] `GET /api/donors/:id` - Get donor details
- [ ] `GET /api/donors/email/:email` - Find by email
- [ ] `PUT /api/donors/:id` - Update donor info
- [ ] `GET /api/donors/:id/donations` - Get donor's donations

### Program APIs
- [ ] `GET /api/programs` - List all programs
- [ ] `GET /api/programs/:id` - Get program details
- [ ] `POST /api/programs` - Create program (admin)
- [ ] `PUT /api/programs/:id` - Update program (admin)
- [ ] `PUT /api/programs/:id/utilize` - Update utilized amount (admin)

### Transparency APIs
- [ ] `GET /api/transparency/summary` - Overall stats
- [ ] `GET /api/transparency/programs` - Program breakdown
- [ ] Calculate total received, utilized, balance

### Donor Wall API
- [ ] `GET /api/donors/wall` - Get public donors
- [ ] Filter by consent (isPublic = true)
- [ ] Sort by amount descending
- [ ] Group by tiers (Platinum, Gold, Silver, Bronze)

---

## ✅ Phase 6: Automation Workflows (Day 9-10)

### Cron Job Setup
- [ ] Install scheduler: `npm install node-cron`
- [ ] Create `/jobs/progressReports.js`
- [ ] Schedule daily run at 9 AM
- [ ] Implement 7-day interval check
- [ ] Implement program completion check

### Progress Report Automation
- [ ] Function to check donations due for report
- [ ] Function to generate report content
- [ ] Function to send email
- [ ] Function to log report sent
- [ ] Function to mark donation inactive when program completes

### Testing Automation
- [ ] Create test donation with past date
- [ ] Manually trigger cron job
- [ ] Verify email sent
- [ ] Check database logs
- [ ] Test program completion flow

---

## ✅ Phase 7: Frontend API Integration (Day 11-12)

### Create API Service File
Create `/src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Programs
  getPrograms: () => fetch(`${API_BASE_URL}/api/programs`).then(r => r.json()),
  
  // Donations
  createDonation: (data) => 
    fetch(`${API_BASE_URL}/api/donations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  verifyPayment: (data) =>
    fetch(`${API_BASE_URL}/api/donations/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  // Transparency
  getTransparencySummary: () =>
    fetch(`${API_BASE_URL}/api/transparency/summary`).then(r => r.json()),
  
  // Donor Wall
  getDonorWall: () =>
    fetch(`${API_BASE_URL}/api/donors/wall`).then(r => r.json()),
    
  // Add more as needed...
};
```

### Replace Mock Data with API Calls

- [ ] `/pages/Home.tsx` - Fetch stats from API
- [ ] `/pages/Services.tsx` - Fetch programs from API
- [ ] `/pages/Donate.tsx` - Connect to donation APIs
- [ ] `/pages/DonorWall.tsx` - Fetch donors from API
- [ ] `/pages/Transparency.tsx` - Fetch transparency data
- [ ] `/pages/Blog.tsx` - Fetch blog posts
- [ ] `/pages/Press.tsx` - Fetch press releases
- [ ] `/pages/ImpactReports.tsx` - Fetch reports

### Handle Loading States
- [ ] Add loading spinners to all pages
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Add empty states

---

## ✅ Phase 8: Admin Dashboard (Day 13-15)

### Authentication
- [ ] Implement JWT authentication
- [ ] Create login page
- [ ] Create admin middleware
- [ ] Protect admin routes

### Admin Features
- [ ] Create/edit programs
- [ ] Update fund utilization
- [ ] View all donations
- [ ] Generate impact reports
- [ ] Manage blog posts
- [ ] Manage press releases

---

## ✅ Phase 9: Testing (Day 16-17)

### Backend Testing
- [ ] Unit tests for all API endpoints
- [ ] Integration tests for payment flow
- [ ] Test Razorpay webhook
- [ ] Test certificate generation
- [ ] Test email delivery
- [ ] Test cron jobs
- [ ] Load testing with 100+ concurrent donations

### Frontend Testing
- [ ] Test all pages load correctly
- [ ] Test navigation
- [ ] Test form validations
- [ ] Test payment flow end-to-end
- [ ] Test mobile responsiveness
- [ ] Test on different browsers

### End-to-End Testing
- [ ] User makes donation → Success page
- [ ] Verify database record created
- [ ] Verify certificates generated
- [ ] Verify email received
- [ ] Verify donor wall updated (if public)
- [ ] Verify transparency dashboard updated
- [ ] Wait 7 days → Verify progress report sent

---

## ✅ Phase 10: Deployment (Day 18-20)

### Backend Deployment
- [ ] Choose hosting (AWS EC2, Heroku, Railway)
- [ ] Set up production database (AWS RDS)
- [ ] Configure environment variables
- [ ] Set up SSL certificate
- [ ] Deploy backend
- [ ] Test API endpoints

### Frontend Deployment
- [ ] Build production: `npm run build`
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Set production environment variables
- [ ] Test deployed site

### Post-Deployment
- [ ] Set up monitoring (New Relic, DataDog)
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up automated backups
- [ ] Create runbook for common issues

---

## 🔐 Security Checklist

- [ ] All API calls use HTTPS
- [ ] Razorpay signatures verified on backend
- [ ] PAN numbers encrypted in database
- [ ] Rate limiting on all endpoints
- [ ] Input validation on all forms
- [ ] SQL injection protection (use parameterized queries)
- [ ] XSS protection (sanitize inputs)
- [ ] CORS configured correctly
- [ ] Admin routes protected with authentication
- [ ] Sensitive data not logged
- [ ] Regular security audits scheduled

---

## 📊 Monitoring Checklist

### Set Up Alerts For:
- [ ] Payment failures
- [ ] Certificate generation failures
- [ ] Email delivery failures
- [ ] Cron job failures
- [ ] API errors (5xx)
- [ ] Database connection issues
- [ ] High server load
- [ ] Disk space low

### Dashboards to Create:
- [ ] Donation metrics (daily, weekly, monthly)
- [ ] Payment success rate
- [ ] Email delivery rate
- [ ] API response times
- [ ] Error rates by endpoint
- [ ] User analytics

---

## 🎯 Go-Live Checklist

### Before Launch:
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimization done
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Backups automated
- [ ] Monitoring active
- [ ] SSL certificate valid
- [ ] Domain configured
- [ ] Email templates reviewed
- [ ] Certificate templates reviewed
- [ ] Legal disclaimers added
- [ ] Privacy policy published
- [ ] Terms of service published

### Launch Day:
- [ ] Announce on social media
- [ ] Send email to mailing list
- [ ] Monitor logs closely
- [ ] Be ready for support requests
- [ ] Have rollback plan ready

### Post-Launch (Week 1):
- [ ] Monitor donation flow
- [ ] Check error rates
- [ ] Verify emails delivered
- [ ] Verify certificates generated
- [ ] Collect user feedback
- [ ] Fix critical bugs immediately

---

## 📞 Quick Links

- **Razorpay Docs**: https://razorpay.com/docs/
- **SendGrid Docs**: https://docs.sendgrid.com/
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **PDFKit Docs**: https://pdfkit.org/

---

## 💡 Tips

1. **Start with Test Mode**: Use Razorpay test keys first
2. **Test Emails**: Use Mailtrap.io for email testing
3. **Database Backups**: Automate daily backups from day 1
4. **Error Logging**: Log everything, you'll need it
5. **Documentation**: Document as you build
6. **Version Control**: Commit frequently
7. **Code Review**: Have someone review before deploying
8. **Staging Environment**: Test on staging before production

---

## ❓ Common Issues & Solutions

### Issue: Razorpay payment succeeds but webhook fails
**Solution**: Implement polling as backup. Check payment status via API.

### Issue: Certificate generation is slow
**Solution**: Use background job queue (Bull, BullMQ)

### Issue: Email delivery fails
**Solution**: Implement retry logic with exponential backoff

### Issue: Cron job doesn't run
**Solution**: Verify server timezone, use absolute cron schedule

### Issue: High database load
**Solution**: Add indexes, implement caching (Redis)

---

## 📝 Notes

- Keep your Razorpay secret key secure (never commit to Git)
- Test webhook with ngrok in development
- Use staging environment for testing
- Keep detailed logs for auditing
- Maintain donor data securely (GDPR compliance)

---

**Last Updated**: February 2026
**Status**: Ready for Backend Integration
**Estimated Total Time**: 15-20 days (full-time development)
