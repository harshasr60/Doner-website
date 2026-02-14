# WOMBTO18 NGO Platform - Technical Architecture & Implementation Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Structure](#database-structure)
5. [Payment Integration](#payment-integration)
6. [Automation Workflows](#automation-workflows)
7. [Security & Compliance](#security--compliance)
8. [Deployment Strategy](#deployment-strategy)

---

## System Overview

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4, React Router
- **Backend** (To be implemented): Node.js/Express or Python/Django/Flask
- **Database** (Recommended): PostgreSQL for relational data, Redis for caching
- **Payment Gateway**: Razorpay
- **File Storage**: AWS S3 or Cloudinary for certificates and documents
- **Email Service**: SendGrid, AWS SES, or similar
- **Automation**: Node-cron or Celery for scheduled tasks

---

## Frontend Architecture

### Current Implementation
```
/
├── App.tsx                 # Root component with RouterProvider
├── routes.tsx              # React Router configuration
├── components/
│   ├── Root.tsx           # Layout wrapper with Header & Footer
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── pages/
│   ├── Home.tsx           # Landing page with hero
│   ├── About.tsx          # About Us page
│   ├── Services.tsx       # Services showcase
│   ├── Blog.tsx           # Blog listing
│   ├── Press.tsx          # Press releases
│   ├── ImpactReports.tsx  # Quarterly reports
│   ├── Donate.tsx         # Donation form & Razorpay
│   ├── DonorWall.tsx      # Public donor recognition
│   ├── Transparency.tsx   # Fund tracking dashboard
│   └── NotFound.tsx       # 404 page
└── data/
    └── mockData.ts        # Mock data (replace with API calls)
```

### Key Features Implemented
- ✅ Multi-page routing with React Router
- ✅ Responsive design with Tailwind CSS
- ✅ Donor consent management (public/anonymous)
- ✅ Razorpay payment integration points
- ✅ Real-time fund transparency display
- ✅ Certificate download UI
- ✅ Mock data structures for all entities

---

## Backend Architecture

### Recommended Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── donationController.js    # Handle donations
│   │   ├── userController.js        # User management
│   │   ├── programController.js     # Program CRUD
│   │   └── reportController.js      # Report generation
│   ├── models/
│   │   ├── Donor.js
│   │   ├── Donation.js
│   │   ├── Program.js
│   │   ├── Certificate.js
│   │   └── ProgressReport.js
│   ├── routes/
│   │   ├── donation.routes.js
│   │   ├── program.routes.js
│   │   └── report.routes.js
│   ├── services/
│   │   ├── razorpayService.js       # Payment processing
│   │   ├── certificateService.js    # PDF generation
│   │   ├── emailService.js          # Email notifications
│   │   └── reportService.js         # Progress reports
│   ├── middleware/
│   │   ├── auth.js                  # Authentication
│   │   ├── validation.js            # Input validation
│   │   └── errorHandler.js          # Error handling
│   ├── utils/
│   │   ├── pdfGenerator.js          # Certificate PDFs
│   │   └── scheduler.js             # Cron jobs
│   └── config/
│       ├── database.js
│       ├── razorpay.js
│       └── email.js
└── package.json
```

### API Endpoints (To Implement)

#### Donation APIs
```
POST   /api/donations/create          # Create donation order
POST   /api/donations/verify          # Verify Razorpay payment
GET    /api/donations/:id             # Get donation details
GET    /api/donations/donor/:donorId  # Get donor's donations
```

#### Program APIs
```
GET    /api/programs                  # List all programs
GET    /api/programs/:id              # Get program details
POST   /api/programs                  # Create program (admin)
PUT    /api/programs/:id              # Update program (admin)
```

#### Certificate APIs
```
GET    /api/certificates/80g/:donationId      # Download 80G cert
GET    /api/certificates/12a/:donationId      # Download 12A cert
POST   /api/certificates/generate             # Generate certificates
```

#### Transparency APIs
```
GET    /api/transparency/summary      # Overall fund summary
GET    /api/transparency/programs     # Program-wise breakdown
GET    /api/transparency/donors       # Donor wall data
```

#### Report APIs
```
GET    /api/reports/impact            # Impact reports listing
GET    /api/reports/progress/:donorId # Donor's progress reports
POST   /api/reports/generate          # Generate new report (admin)
```

---

## Database Structure

### PostgreSQL Schema

#### 1. Donors Table
```sql
CREATE TABLE donors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    pan_number VARCHAR(10),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_donors_email ON donors(email);
```

#### 2. Programs Table
```sql
CREATE TABLE programs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    utilized_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_status ON programs(status);
```

#### 3. Donations Table
```sql
CREATE TABLE donations (
    id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) REFERENCES donors(id),
    program_id VARCHAR(50) REFERENCES programs(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_80g_url VARCHAR(500),
    certificate_12a_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_program ON donations(program_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
```

#### 4. Progress Reports Table
```sql
CREATE TABLE progress_reports (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) REFERENCES donations(id),
    program_id VARCHAR(50) REFERENCES programs(id),
    report_date DATE NOT NULL,
    content TEXT NOT NULL,
    images_json TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_donation ON progress_reports(donation_id);
CREATE INDEX idx_reports_sent ON progress_reports(sent_at);
```

#### 5. Impact Reports Table
```sql
CREATE TABLE impact_reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    quarter VARCHAR(2) NOT NULL,
    year INTEGER NOT NULL,
    programs_count INTEGER,
    beneficiaries INTEGER,
    funds_utilized DECIMAL(12, 2),
    report_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100),
    category VARCHAR(100),
    image_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Press Releases Table
```sql
CREATE TABLE press_releases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    source VARCHAR(100),
    external_link VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Email Logs Table
```sql
CREATE TABLE email_logs (
    id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) REFERENCES donors(id),
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    sent_at TIMESTAMP,
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Payment Integration

### Razorpay Integration Flow

#### 1. Frontend Donation Form Submission
```javascript
// User fills form and clicks "Proceed to Payment"
const handleDonation = async (formData) => {
    // Step 1: Create order on your backend
    const response = await fetch('/api/donations/create', {
        method: 'POST',
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
    
    const { orderId, amount, donorId } = await response.json();
    
    // Step 2: Open Razorpay checkout
    const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        order_id: orderId,
        name: 'WOMBTO18',
        description: 'Donation',
        handler: function(razorpayResponse) {
            verifyPayment(razorpayResponse, donorId);
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
};
```

#### 2. Backend Order Creation
```javascript
// /api/donations/create
const createDonationOrder = async (req, res) => {
    const { amount, programId, donorDetails } = req.body;
    
    // Create or get donor
    let donor = await Donor.findByEmail(donorDetails.email);
    if (!donor) {
        donor = await Donor.create(donorDetails);
    }
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    });
    
    // Create donation record
    const donation = await Donation.create({
        donorId: donor.id,
        programId,
        amount,
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending'
    });
    
    res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        donorId: donor.id,
        donationId: donation.id
    });
};
```

#### 3. Payment Verification
```javascript
// /api/donations/verify
const verifyPayment = async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        donationId 
    } = req.body;
    
    // Verify signature
    const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );
    
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Update donation
    const donation = await Donation.update(donationId, {
        razorpay_payment_id,
        razorpay_signature,
        payment_status: 'success',
        transaction_id: `TXN${Date.now()}`
    });
    
    // Update program raised amount
    await Program.incrementRaisedAmount(
        donation.program_id, 
        donation.amount
    );
    
    // Trigger post-payment actions
    await postPaymentActions(donation);
    
    res.json({ success: true, donation });
};
```

#### 4. Post-Payment Actions
```javascript
const postPaymentActions = async (donation) => {
    // 1. Generate certificates
    const cert80G = await generateCertificate80G(donation);
    const cert12A = await generateCertificate12A(donation);
    
    await Donation.update(donation.id, {
        certificate_80g_url: cert80G.url,
        certificate_12a_url: cert12A.url
    });
    
    // 2. Send confirmation email
    await sendConfirmationEmail(donation);
    
    // 3. Schedule progress reports
    await scheduleProgressReports(donation);
    
    // 4. Update donor wall if public
    if (donation.donor.is_public) {
        await updateDonorWall(donation);
    }
};
```

---

## Automation Workflows

### 1. Certificate Generation (Immediate)

**Technology**: PDFKit (Node.js) or ReportLab (Python)

```javascript
const generateCertificate80G = async (donation) => {
    const donor = await Donor.findById(donation.donor_id);
    const program = await Program.findById(donation.program_id);
    
    const doc = new PDFDocument();
    
    // Header
    doc.fontSize(20).text('WOMBTO18', { align: 'center' });
    doc.fontSize(16).text('80G Tax Exemption Certificate', { align: 'center' });
    
    // Organization details
    doc.fontSize(10).text('Registered under Section 80G of Income Tax Act, 1961');
    doc.text('Registration No: XXXXXXXX');
    
    // Donor details
    doc.fontSize(12).text(`Donor Name: ${donor.name}`);
    doc.text(`PAN Number: ${donor.pan_number || 'N/A'}`);
    doc.text(`Transaction ID: ${donation.transaction_id}`);
    doc.text(`Amount: ₹${donation.amount}`);
    doc.text(`Date: ${new Date(donation.donation_date).toLocaleDateString()}`);
    doc.text(`Program: ${program.name}`);
    
    // Footer
    doc.text('This is a computer-generated certificate');
    
    // Save to S3
    const pdfBuffer = await generatePDFBuffer(doc);
    const url = await uploadToS3(pdfBuffer, `certificates/80g/${donation.id}.pdf`);
    
    return { url };
};
```

### 2. Email Notifications (Immediate)

**Technology**: SendGrid, AWS SES, or Nodemailer

```javascript
const sendConfirmationEmail = async (donation) => {
    const donor = await Donor.findById(donation.donor_id);
    
    const emailData = {
        to: donor.email,
        subject: 'Thank you for your donation to WOMBTO18',
        template: 'donation-confirmation',
        data: {
            donorName: donor.name,
            amount: donation.amount,
            transactionId: donation.transaction_id,
            donorId: donor.id,
            certificate80GUrl: donation.certificate_80g_url,
            certificate12AUrl: donation.certificate_12a_url,
            programName: program.name
        }
    };
    
    await emailService.send(emailData);
    
    // Log email
    await EmailLog.create({
        donor_id: donor.id,
        email_type: 'confirmation',
        subject: emailData.subject,
        sent_at: new Date(),
        status: 'sent'
    });
};
```

### 3. 7-Day Progress Reports (Scheduled)

**Technology**: Node-cron or Celery (Python)

```javascript
// Cron job running daily at 9 AM
cron.schedule('0 9 * * *', async () => {
    console.log('Running 7-day progress report job...');
    
    // Get all active donations
    const activeDonations = await Donation.findActive();
    
    for (const donation of activeDonations) {
        const daysSinceDonation = getDaysDifference(
            donation.donation_date, 
            new Date()
        );
        
        // Send report every 7 days
        if (daysSinceDonation % 7 === 0) {
            await sendProgressReport(donation);
        }
        
        // Check if program is completed
        const program = await Program.findById(donation.program_id);
        if (program.status === 'completed') {
            await sendFinalReport(donation);
            await Donation.markInactive(donation.id);
        }
    }
});

const sendProgressReport = async (donation) => {
    const donor = await Donor.findById(donation.donor_id);
    const program = await Program.findById(donation.program_id);
    
    // Generate report content
    const reportContent = await generateProgramProgress(program);
    
    // Save report
    const report = await ProgressReport.create({
        donation_id: donation.id,
        program_id: program.id,
        report_date: new Date(),
        content: reportContent
    });
    
    // Send email
    await emailService.send({
        to: donor.email,
        subject: `Progress Update: ${program.name}`,
        template: 'progress-report',
        data: {
            donorName: donor.name,
            programName: program.name,
            reportContent: reportContent,
            utilizationPercentage: (program.utilized_amount / program.raised_amount) * 100
        }
    });
    
    await ProgressReport.update(report.id, { sent_at: new Date() });
};
```

### 4. Transparency Dashboard Updates (Real-time)

```javascript
// Webhook from admin panel when funds are utilized
app.post('/api/programs/:id/utilize-funds', async (req, res) => {
    const { id } = req.params;
    const { amount, description } = req.body;
    
    // Update program
    await Program.incrementUtilizedAmount(id, amount);
    
    // Broadcast to connected clients (WebSocket)
    io.emit('transparency-update', {
        programId: id,
        utilizedAmount: amount,
        timestamp: new Date()
    });
    
    res.json({ success: true });
});
```

---

## Security & Compliance

### 1. Data Protection
- **Encryption**: All sensitive data encrypted at rest (AES-256)
- **HTTPS**: SSL/TLS certificates mandatory
- **PII Protection**: PAN numbers, emails hashed in logs
- **Access Control**: Role-based access for admin functions

### 2. Payment Security
- **Razorpay Signature Verification**: Always verify payment signatures
```javascript
const crypto = require('crypto');

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    
    return generatedSignature === signature;
};
```

### 3. Compliance
- **80G/12A Compliance**: Maintain proper records for tax authorities
- **Data Retention**: Store donation records for minimum 7 years
- **Audit Trail**: Log all financial transactions
- **GDPR-like Privacy**: Honor data deletion requests

### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const donationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 donations per window
    message: 'Too many donation attempts, please try again later'
});

app.post('/api/donations/create', donationLimiter, createDonationOrder);
```

---

## Deployment Strategy

### Frontend Deployment
- **Platform**: Vercel, Netlify, or AWS Amplify
- **Build Command**: `npm run build`
- **Environment Variables**:
  - `VITE_API_BASE_URL`
  - `VITE_RAZORPAY_KEY_ID`

### Backend Deployment
- **Platform**: AWS EC2, Google Cloud Run, or Heroku
- **Database**: AWS RDS (PostgreSQL) or Google Cloud SQL
- **File Storage**: AWS S3 or Cloudinary
- **Environment Variables**:
  - `DATABASE_URL`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_SECRET`
  - `EMAIL_API_KEY`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `JWT_SECRET`

### Monitoring & Logging
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Log Management**: CloudWatch, Loggly
- **Uptime Monitoring**: Pingdom, UptimeRobot

---

## Implementation Checklist

### Phase 1: Backend Setup (Week 1-2)
- [ ] Set up Node.js/Express or Python/Django project
- [ ] Configure PostgreSQL database
- [ ] Implement donor and program models
- [ ] Create API endpoints for programs
- [ ] Set up authentication/authorization

### Phase 2: Payment Integration (Week 3)
- [ ] Configure Razorpay account
- [ ] Implement order creation API
- [ ] Implement payment verification
- [ ] Set up webhook handlers
- [ ] Test payment flow end-to-end

### Phase 3: Certificate Generation (Week 4)
- [ ] Set up PDF generation library
- [ ] Design 80G certificate template
- [ ] Design 12A certificate template
- [ ] Implement S3/Cloudinary upload
- [ ] Test certificate generation

### Phase 4: Email System (Week 5)
- [ ] Configure SendGrid/AWS SES
- [ ] Create email templates
- [ ] Implement confirmation emails
- [ ] Implement progress report emails
- [ ] Set up email logging

### Phase 5: Automation (Week 6)
- [ ] Set up cron jobs for scheduled tasks
- [ ] Implement 7-day progress report scheduler
- [ ] Implement program completion detection
- [ ] Test automation workflows

### Phase 6: Admin Dashboard (Week 7-8)
- [ ] Build admin authentication
- [ ] Create program management UI
- [ ] Create fund utilization tracking
- [ ] Create donor management
- [ ] Create report generation tools

### Phase 7: Testing & Launch (Week 9-10)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance testing
- [ ] Deploy to production
- [ ] Monitor and iterate

---

## Support & Maintenance

### Regular Tasks
1. **Daily**: Monitor error logs and payment failures
2. **Weekly**: Review donor feedback and update content
3. **Monthly**: Generate and publish impact reports
4. **Quarterly**: Financial audit and compliance review
5. **Yearly**: Renew SSL certificates and licenses

### Contact for Development
- Frontend: Ready for backend integration
- Backend: Implement according to this architecture
- DevOps: Follow deployment strategy above

---

**Last Updated**: February 2026
**Version**: 1.0
**Maintained by**: WOMBTO18 Development Team
