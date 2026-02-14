# Razorpay Integration Guide for WOMBTO18

## 🚀 Quick Start

This guide helps you integrate Razorpay payment gateway with the WOMBTO18 donation system.

---

## 📋 Prerequisites

1. Razorpay account (sign up at https://razorpay.com)
2. Backend server running (Node.js/Express recommended)
3. Frontend running locally
4. PostgreSQL database set up

---

## 🔧 Step-by-Step Integration

### Step 1: Razorpay Account Setup

1. **Sign Up**
   - Go to https://razorpay.com
   - Click "Sign Up" and create account
   - Complete business verification (KYC)

2. **Get API Credentials**
   - Login to Razorpay Dashboard
   - Go to Settings → API Keys
   - Generate Test Keys (for development)
   - Copy **Key ID** and **Key Secret**

3. **Enable Payment Methods**
   - Go to Settings → Payment Methods
   - Enable: Cards, UPI, Net Banking, Wallets
   - Save settings

---

### Step 2: Frontend Setup

#### 2.1 Add Razorpay Script

Add this to your `index.html` (in the `<head>` section):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WOMBTO18 - NGO Platform</title>
    
    <!-- Add Razorpay Script -->
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### 2.2 Create Environment File

Create `.env` in root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Razorpay Test Keys
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important**: Never commit `.env` to Git! Add to `.gitignore`:
```
.env
.env.local
.env.production
```

#### 2.3 Update Donate Page

The `/pages/Donate.tsx` is already configured. Just update line 60:

**Before:**
```typescript
key: 'YOUR_RAZORPAY_KEY_ID',
```

**After:**
```typescript
key: import.meta.env.VITE_RAZORPAY_KEY_ID,
```

---

### Step 3: Backend Setup

#### 3.1 Install Razorpay SDK

```bash
npm install razorpay
```

#### 3.2 Create Razorpay Configuration

Create `config/razorpay.js`:

```javascript
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpayInstance;
```

#### 3.3 Create Donation Controller

Create `controllers/donationController.js`:

```javascript
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const { Donor, Donation, Program } = require('../models');

// Create Razorpay Order
exports.createDonationOrder = async (req, res) => {
    try {
        const { amount, programId, donorDetails } = req.body;

        // Validate input
        if (!amount || !programId || !donorDetails) {
            return res.status(400).json({ 
                error: 'Missing required fields' 
            });
        }

        // Create or get donor
        let donor = await Donor.findOne({ 
            where: { email: donorDetails.email } 
        });

        if (!donor) {
            donor = await Donor.create({
                id: `DON${Date.now()}`,
                name: donorDetails.name,
                email: donorDetails.email,
                mobile: donorDetails.mobile,
                pan_number: donorDetails.panNumber,
                is_public: donorDetails.isPublic
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                program_id: programId,
                donor_id: donor.id
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Create donation record (pending status)
        const donation = await Donation.create({
            id: `TXN${Date.now()}`,
            donor_id: donor.id,
            program_id: programId,
            amount: amount,
            razorpay_order_id: razorpayOrder.id,
            payment_status: 'pending',
            transaction_id: `TXN${Date.now()}`
        });

        res.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            donorId: donor.id,
            donationId: donation.id
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            message: error.message 
        });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
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
            // Update donation as failed
            await Donation.update(
                { payment_status: 'failed' },
                { where: { id: donationId } }
            );

            return res.status(400).json({ 
                error: 'Invalid payment signature' 
            });
        }

        // Update donation record
        const donation = await Donation.findByPk(donationId);
        
        await donation.update({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            payment_status: 'success',
            donation_date: new Date()
        });

        // Update program raised amount
        const program = await Program.findByPk(donation.program_id);
        await program.increment('raised_amount', { 
            by: parseFloat(donation.amount) 
        });

        // Trigger post-payment actions asynchronously
        // (Don't wait for these to complete before responding)
        postPaymentActions(donation).catch(console.error);

        res.json({
            success: true,
            donation: {
                id: donation.id,
                transactionId: donation.transaction_id,
                amount: donation.amount,
                status: donation.payment_status
            }
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ 
            error: 'Failed to verify payment',
            message: error.message 
        });
    }
};

// Helper: Verify Razorpay Signature
function verifyRazorpaySignature(orderId, paymentId, signature) {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
}

// Helper: Post-Payment Actions
async function postPaymentActions(donation) {
    try {
        // 1. Generate certificates
        const cert80G = await generateCertificate80G(donation);
        const cert12A = await generateCertificate12A(donation);
        
        await donation.update({
            certificate_80g_url: cert80G.url,
            certificate_12a_url: cert12A.url
        });

        // 2. Send confirmation email
        await sendConfirmationEmail(donation);

        // 3. Schedule progress reports (handled by cron job)
        
    } catch (error) {
        console.error('Error in post-payment actions:', error);
        // Log to monitoring system
    }
}

module.exports = exports;
```

#### 3.4 Create Routes

Create `routes/donation.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Create donation order
router.post('/create', donationController.createDonationOrder);

// Verify payment
router.post('/verify', donationController.verifyPayment);

module.exports = router;
```

#### 3.5 Register Routes in Main App

In your `server.js` or `app.js`:

```javascript
const express = require('express');
const cors = require('cors');
const donationRoutes = require('./routes/donation.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donations', donationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

### Step 4: Webhook Setup (Important!)

Webhooks ensure you capture payments even if user closes browser.

#### 4.1 Create Webhook Handler

Create `controllers/webhookController.js`:

```javascript
const crypto = require('crypto');
const { Donation } = require('../models');

exports.handleRazorpayWebhook = async (req, res) => {
    try {
        // Verify webhook signature
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (webhookSignature !== expectedSignature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Process webhook event
        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload);
                break;

            case 'payment.failed':
                await handlePaymentFailed(payload);
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

async function handlePaymentCaptured(payment) {
    // Update donation status
    await Donation.update(
        { 
            payment_status: 'success',
            razorpay_payment_id: payment.id
        },
        { 
            where: { razorpay_order_id: payment.order_id } 
        }
    );

    console.log('Payment captured:', payment.id);
}

async function handlePaymentFailed(payment) {
    await Donation.update(
        { payment_status: 'failed' },
        { where: { razorpay_order_id: payment.order_id } }
    );

    console.log('Payment failed:', payment.id);
}
```

#### 4.2 Add Webhook Route

In `routes/webhook.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Razorpay webhook
router.post('/razorpay', webhookController.handleRazorpayWebhook);

module.exports = router;
```

Register in `app.js`:
```javascript
app.use('/api/webhooks', require('./routes/webhook.routes'));
```

#### 4.3 Configure Webhook in Razorpay Dashboard

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Click "Create New Webhook"
3. Enter webhook URL: `https://your-backend.com/api/webhooks/razorpay`
4. Select events: `payment.captured`, `payment.failed`
5. Generate webhook secret
6. Add secret to `.env`: `RAZORPAY_WEBHOOK_SECRET=your_secret_here`
7. Save webhook

---

### Step 5: Testing

#### 5.1 Test in Development (with ngrok)

Since Razorpay needs a public URL for webhooks:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend server
npm start

# In another terminal, expose it
ngrok http 5000
```

Use the ngrok URL for webhook in Razorpay dashboard.

#### 5.2 Test Card Details (Test Mode)

Use these test cards in Razorpay test mode:

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

**Failure:**
- Card: `4111 1111 1111 1234`
- CVV: Any 3 digits
- Expiry: Any future date

**UPI:**
- VPA: `success@razorpay`

#### 5.3 Test Flow

1. Open frontend: http://localhost:5173
2. Navigate to `/donate`
3. Fill form with test data
4. Click "Proceed to Payment"
5. Razorpay checkout opens
6. Use test card details
7. Complete payment
8. Verify:
   - Success page shows
   - Database updated
   - Certificate URLs generated
   - Email sent

---

### Step 6: Production Deployment

#### 6.1 Switch to Live Mode

1. In Razorpay Dashboard → Settings → API Keys
2. Generate Live Keys
3. Update `.env.production`:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
```

4. Update frontend env:
```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

#### 6.2 Update Webhook URL

Update webhook in Razorpay Dashboard to production URL:
```
https://api.wombto18.org/api/webhooks/razorpay
```

#### 6.3 Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Webhook signature verification enabled
- [ ] Payment signature verification enabled
- [ ] HTTPS enabled on backend
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive data
- [ ] Logs don't contain secrets

---

## 🔍 Debugging

### Common Issues

#### 1. Razorpay script not loading
**Solution**: Check browser console. Ensure script tag is in `index.html`.

#### 2. "Razorpay is not defined"
**Solution**: Make sure script loads before React app. Add to `<head>`.

#### 3. Payment signature verification fails
**Solution**: 
- Check RAZORPAY_KEY_SECRET is correct
- Ensure order_id and payment_id are correct
- Verify you're using the right separator: `${orderId}|${paymentId}`

#### 4. Webhook not receiving events
**Solution**:
- Use ngrok for local testing
- Verify webhook URL is accessible
- Check webhook secret matches
- Look at Razorpay Dashboard → Webhooks → Event Logs

#### 5. Payment succeeds but database not updated
**Solution**:
- Check backend logs for errors
- Verify database connection
- Ensure transaction ID is unique
- Check foreign key constraints

### Enable Debug Logging

Add to backend:

```javascript
// Log all Razorpay events
razorpayInstance.on('error', (error) => {
    console.error('Razorpay Error:', error);
});
```

---

## 📊 Monitoring

### Key Metrics to Track

1. **Payment Success Rate**
   ```sql
   SELECT 
       COUNT(CASE WHEN payment_status = 'success' THEN 1 END)::float / 
       COUNT(*)::float * 100 as success_rate
   FROM donations
   WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
   ```

2. **Average Donation Amount**
   ```sql
   SELECT AVG(amount) as avg_donation
   FROM donations
   WHERE payment_status = 'success';
   ```

3. **Failed Payments**
   ```sql
   SELECT * FROM donations
   WHERE payment_status = 'failed'
   ORDER BY created_at DESC;
   ```

---

## 🚨 Error Handling

### Frontend Error Handling

```typescript
// In Donate.tsx
const handleDonation = async (e: React.FormEvent) => {
    try {
        // Create order
        const response = await fetch(`${API_URL}/api/donations/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const data = await response.json();
        
        // Open Razorpay
        const rzp = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            order_id: data.orderId,
            handler: handlePaymentSuccess,
            modal: {
                ondismiss: () => {
                    alert('Payment cancelled. Please try again.');
                }
            }
        });

        rzp.on('payment.failed', function (response) {
            alert('Payment failed: ' + response.error.description);
            // Log to backend
            fetch(`${API_URL}/api/logs/payment-failed`, {
                method: 'POST',
                body: JSON.stringify(response.error)
            });
        });

        rzp.open();

    } catch (error) {
        console.error('Donation error:', error);
        alert('Something went wrong. Please try again.');
    }
};
```

---

## 📞 Support

### Razorpay Support
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs
- Support: support@razorpay.com
- Phone: 1800-102-5071

### Testing Environment
- Test Dashboard: https://dashboard.razorpay.com/test
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## ✅ Launch Checklist

Before going live:

- [ ] Test with all payment methods (Card, UPI, Net Banking)
- [ ] Test payment success flow
- [ ] Test payment failure flow
- [ ] Test webhook delivery
- [ ] Verify certificate generation
- [ ] Verify email delivery
- [ ] Test on mobile devices
- [ ] Test with different browsers
- [ ] Review Razorpay dashboard settings
- [ ] Enable only required payment methods
- [ ] Set up payment notifications
- [ ] Configure settlement account
- [ ] Test refund process
- [ ] Document runbook for payment issues
- [ ] Set up monitoring alerts
- [ ] Train support team

---

**Last Updated**: February 2026
**Razorpay API Version**: v1
**Tested With**: Node.js 18+, React 18
