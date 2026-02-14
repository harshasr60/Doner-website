# WOMBTO18 Platform - Data Flow & System Diagrams

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (React Frontend)                           │
│                                                                 │
│  Home │ About │ Services │ Blog │ Press │ Reports │ Donate     │
│              │ Transparency │ Donor Wall │                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS / REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND SERVER                               │
│                  (Node.js / Python)                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Donation    │  │   Program    │  │   Report     │         │
│  │  Controller  │  │  Controller  │  │  Controller  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                 │
│  ┌──────▼──────────────────▼──────────────────▼───────┐        │
│  │           Business Logic Layer                      │        │
│  │  • Payment Processing   • Certificate Generation    │        │
│  │  • Email Queueing      • Report Scheduling          │        │
│  └──────────────────────────────────────────────┬──────┘        │
└─────────────────────────────────────────────────┼───────────────┘
                                                  │
        ┌─────────────────────────────────────────┼───────────────┐
        │                                         │               │
        │                                         │               │
┌───────▼────────┐  ┌──────────▼──────────┐  ┌──▼──────────┐   │
│   PostgreSQL   │  │   Razorpay API      │  │  SendGrid   │   │
│   Database     │  │   (Payment)         │  │  (Email)    │   │
└────────────────┘  └─────────────────────┘  └─────────────┘   │
                                                                 │
┌────────────────┐  ┌─────────────────────┐  ┌─────────────┐   │
│   AWS S3 /     │  │   Redis             │  │  Cron Jobs  │   │
│   Cloudinary   │  │   (Cache)           │  │  (Scheduler)│   │
│   (Files)      │  │                     │  │             │   │
└────────────────┘  └─────────────────────┘  └─────────────┘   │
                                                                 │
                    EXTERNAL SERVICES                            │
                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Donation Flow (End-to-End)

### Complete User Journey

```
┌──────────────┐
│    USER      │
│  Opens Site  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Browses Home    │
│  Reads About Us  │
│  Views Services  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Clicks "Donate"  │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          DONATION FORM                  │
│                                         │
│  1. Personal Info                       │
│     • Name                              │
│     • Email                             │
│     • Mobile                            │
│     • PAN (optional)                    │
│                                         │
│  2. Donation Details                    │
│     • Select Program                    │
│     • Enter Amount                      │
│                                         │
│  3. Privacy Choice                      │
│     ☑ Display name publicly             │
│     ☐ Remain anonymous                  │
│                                         │
│  [Proceed to Payment Button]            │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     FRONTEND: Submit to Backend         │
│                                         │
│  POST /api/donations/create             │
│  {                                      │
│    amount: 5000,                        │
│    programId: "PROG001",                │
│    donorDetails: {...}                  │
│  }                                      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   BACKEND: Create Order                 │
│                                         │
│  1. Validate input                      │
│  2. Create/Find Donor in DB             │
│     → donors table                      │
│                                         │
│  3. Call Razorpay API                   │
│     → razorpay.orders.create()          │
│                                         │
│  4. Create Donation Record (pending)    │
│     → donations table                   │
│                                         │
│  5. Return order_id to Frontend         │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  FRONTEND: Open Razorpay Checkout       │
│                                         │
│  new Razorpay({                         │
│    key: "rzp_live_xxx",                 │
│    order_id: "order_xxx",               │
│    handler: onSuccess                   │
│  }).open()                              │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      RAZORPAY CHECKOUT PAGE             │
│                                         │
│  User enters card details               │
│  Completes payment                      │
│                                         │
│  ✅ Success → handler() called          │
│  ❌ Failure → payment.failed event      │
└─────────────┬───────────────────────────┘
              │
              ▼ (On Success)
┌─────────────────────────────────────────┐
│  FRONTEND: Verify Payment               │
│                                         │
│  POST /api/donations/verify             │
│  {                                      │
│    razorpay_order_id: "order_xxx",      │
│    razorpay_payment_id: "pay_xxx",      │
│    razorpay_signature: "sig_xxx"        │
│  }                                      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   BACKEND: Verify & Process             │
│                                         │
│  1. Verify Razorpay Signature           │
│     ✅ Valid → Continue                 │
│     ❌ Invalid → Return Error           │
│                                         │
│  2. Update Donation (success)           │
│     → donations.payment_status = success│
│     → donations.razorpay_payment_id     │
│                                         │
│  3. Update Program Raised Amount        │
│     → programs.raised_amount += amount  │
│                                         │
│  4. Trigger Post-Payment Actions        │
│     (Async - don't wait)                │
└─────────────┬───────────────────────────┘
              │
              ├──────────────┬─────────────┬──────────────┐
              │              │             │              │
              ▼              ▼             ▼              ▼
    ┌─────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Generate    │  │ Generate │  │  Send    │  │ Schedule │
    │ 80G Cert    │  │ 12A Cert │  │  Email   │  │ Reports  │
    │             │  │          │  │          │  │          │
    │ • Create    │  │ • Create │  │ • Confirm│  │ • Mark   │
    │   PDF       │  │   PDF    │  │ • Details│  │   for    │
    │ • Upload    │  │ • Upload │  │ • Certs  │  │   7-day  │
    │   to S3     │  │   to S3  │  │ • Donor  │  │   cron   │
    │ • Save URL  │  │ • Save   │  │   ID     │  │          │
    │             │  │   URL    │  │          │  │          │
    └─────────────┘  └──────────┘  └──────────┘  └──────────┘
              │              │             │              │
              └──────────────┴─────────────┴──────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   All Actions Complete   │
              └──────────────┬───────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │  FRONTEND: Success Page  │
              │                          │
              │  ✅ Thank You!           │
              │  💳 Transaction ID       │
              │  📄 Download 80G Cert    │
              │  📄 Download 12A Cert    │
              │  📧 Email Sent           │
              │  📊 Track on Dashboard   │
              └──────────────────────────┘
```

---

## 📧 Email Automation Flow

### Immediate Confirmation Email

```
┌──────────────────┐
│  Payment Success │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│  Trigger: sendConfirmationEmail() │
└────────┬───────────────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
         ▼              ▼              ▼
┌─────────────┐  ┌──────────┐  ┌──────────┐
│ Get Donor   │  │ Get      │  │ Get      │
│ Details     │  │ Program  │  │ Cert     │
│             │  │ Details  │  │ URLs     │
└─────────────┘  └──────────┘  └──────────┘
         │              │              │
         └──────────────┴──────────────┘
                        │
                        ▼
         ┌──────────────────────────┐
         │  Render Email Template   │
         │                          │
         │  Subject: Thank you!     │
         │  Body:                   │
         │  • Thank you message     │
         │  • Donor name            │
         │  • Amount donated        │
         │  • Transaction ID        │
         │  • Program name          │
         │  • Certificate links     │
         │  • What happens next     │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │   Send via SendGrid      │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │   Log to email_logs      │
         │   status: 'sent'         │
         └──────────────────────────┘
```

### 7-Day Progress Reports (Cron Job)

```
┌─────────────────────┐
│  Daily at 9:00 AM   │
│  Cron Job Triggers  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│  Query active_donations view │
│  WHERE is_active = true      │
│  AND payment_status = success│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  For Each Donation:          │
│                              │
│  Calculate days since:       │
│  today - donation_date       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  IF days % 7 === 0           │
│  (i.e., 7, 14, 21, 28...)    │
└──────────┬───────────────────┘
           │ Yes
           ▼
┌──────────────────────────────┐
│  Check Program Status        │
└──────────┬───────────────────┘
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
┌─────────┐  ┌─────────┐
│ Active  │  │Completed│
└────┬────┘  └────┬────┘
     │            │
     │            ▼
     │     ┌──────────────────┐
     │     │ Send Final Report│
     │     │ Mark Inactive    │
     │     └──────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Generate Progress Report    │
│                              │
│  1. Get program progress     │
│  2. Calculate utilization    │
│  3. Get latest activities    │
│  4. Format report content    │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Save to progress_reports    │
│  table                       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Send Email to Donor         │
│                              │
│  Subject: Week N Progress    │
│  Body:                       │
│  • Program updates           │
│  • Current status            │
│  • Funds utilized            │
│  • Beneficiaries served      │
│  • Photos/Stories            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Update progress_reports     │
│  SET sent_at = NOW()         │
└──────────────────────────────┘
```

---

## 🔍 Transparency Dashboard Data Flow

```
┌─────────────────────┐
│  User Opens         │
│  /transparency      │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│  Frontend: Fetch Data        │
│                              │
│  GET /api/transparency/summary│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Backend: Calculate Metrics  │
│                              │
│  Query 1: Total Received     │
│  SELECT SUM(amount)          │
│  FROM donations              │
│  WHERE payment_status=success│
│                              │
│  Query 2: Total Utilized     │
│  SELECT SUM(utilized_amount) │
│  FROM programs               │
│                              │
│  Query 3: Program Breakdown  │
│  SELECT * FROM transparency_ │
│  summary VIEW                │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Return JSON:                │
│  {                           │
│    totalReceived: 12500000,  │
│    totalUtilized: 9800000,   │
│    balance: 2700000,         │
│    programs: [               │
│      {                       │
│        id: "PROG001",        │
│        name: "Education",    │
│        raised: 3500000,      │
│        utilized: 2800000,    │
│        percentage: 80        │
│      },                      │
│      ...                     │
│    ]                         │
│  }                           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Frontend: Render Dashboard  │
│                              │
│  1. Summary Cards            │
│     • Total Received         │
│     • Total Utilized         │
│     • Balance                │
│                              │
│  2. Progress Bar             │
│     • Overall utilization    │
│                              │
│  3. Program Cards            │
│     • Each program breakdown │
│     • Individual progress    │
│                              │
│  4. Real-time Updates        │
│     • WebSocket (optional)   │
│     • Poll every 30s         │
└──────────────────────────────┘
```

---

## 👥 Donor Wall Data Flow

```
┌─────────────────────┐
│  User Opens         │
│  /donor-wall        │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│  Frontend: Fetch Donors      │
│                              │
│  GET /api/donors/wall        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Backend: Query Database     │
│                              │
│  SELECT                      │
│    d.id,                     │
│    CASE                      │
│      WHEN don.is_public THEN │
│        don.name              │
│      ELSE                    │
│        CONCAT('Donor ',d.id) │
│    END as display_name,      │
│    d.amount,                 │
│    d.donation_date,          │
│    p.name as program         │
│  FROM donations d            │
│  JOIN donors don             │
│    ON d.donor_id = don.id    │
│  JOIN programs p             │
│    ON d.program_id = p.id    │
│  WHERE d.payment_status =    │
│    'success'                 │
│  ORDER BY d.amount DESC      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Frontend: Group by Tiers    │
│                              │
│  Platinum: >= ₹1,00,000      │
│  Gold:     >= ₹50,000        │
│  Silver:   >= ₹25,000        │
│  Bronze:   < ₹25,000         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Render Donor Cards          │
│                              │
│  For each tier:              │
│    • Display name (or ID)    │
│    • Amount contributed      │
│    • Date of donation        │
│    • Badge/Icon              │
│                              │
│  Privacy Notice:             │
│    • Public donors shown     │
│    • Anonymous shown as ID   │
└──────────────────────────────┘
```

---

## 🔄 Real-time Updates Flow

### WebSocket (Optional Enhancement)

```
┌─────────────────┐
│  Admin Updates  │
│  Fund Utilized  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  POST /api/programs/    │
│       utilize-funds     │
│                         │
│  {                      │
│    programId: "PROG001",│
│    amount: 50000,       │
│    description: "..."   │
│  }                      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Update Database        │
│                         │
│  programs.utilized_     │
│  amount += 50000        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Emit WebSocket Event   │
│                         │
│  io.emit('transparency-│
│  update', {             │
│    programId,           │
│    utilizedAmount,      │
│    timestamp            │
│  })                     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  All Connected Clients  │
│  (Transparency Page)    │
│                         │
│  Update Dashboard       │
│  Without Page Refresh   │
└─────────────────────────┘
```

---

## 📊 Database Relationships

```
┌─────────────────┐
│     donors      │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ mobile          │
│ pan_number      │
│ is_public       │
└────────┬────────┘
         │ 1
         │
         │ N
         │
┌────────▼────────┐         ┌─────────────────┐
│   donations     │ N     1 │    programs     │
│─────────────────│◄────────┤─────────────────│
│ id (PK)         │         │ id (PK)         │
│ donor_id (FK)   │         │ name            │
│ program_id (FK) ├────────►│ description     │
│ amount          │         │ target_amount   │
│ razorpay_...    │         │ raised_amount   │
│ payment_status  │         │ utilized_amount │
│ certificate_... │         │ status          │
└────────┬────────┘         └─────────────────┘
         │ 1
         │
         │ N
         │
┌────────▼──────────┐
│ progress_reports  │
│───────────────────│
│ id (PK)           │
│ donation_id (FK)  │
│ program_id (FK)   │
│ report_date       │
│ content           │
│ sent_at           │
└───────────────────┘

┌─────────────────┐
│  email_logs     │
│─────────────────│
│ id (PK)         │
│ donor_id (FK)   │
│ email_type      │
│ subject         │
│ sent_at         │
│ status          │
└─────────────────┘
```

---

## ⏱️ Timeline of Events After Donation

```
T+0 seconds:   User completes payment
               │
               ▼
T+0 seconds:   Razorpay calls handler()
               Frontend sends to /verify
               │
               ▼
T+1 second:    Backend verifies signature
               Updates database
               Returns success
               │
               ▼
T+2 seconds:   Show success page
               │
               ├─── (Async Actions Start)
               │
               ├─► Generate 80G cert → T+5s
               ├─► Generate 12A cert → T+5s
               ├─► Send email → T+10s
               │
               ▼
T+10 seconds:  Email received by donor
               Certificates ready
               │
               ▼
T+7 days:      First progress report
               │
               ▼
T+14 days:     Second progress report
               │
               ▼
T+21 days:     Third progress report
               │
               ▼
...            (Every 7 days)
               │
               ▼
Program End:   Final report sent
               Donation marked inactive
```

---

## 🔐 Security Data Flow

```
┌─────────────┐
│   User      │
│   Browser   │
└──────┬──────┘
       │ HTTPS
       │ (SSL/TLS encrypted)
       │
       ▼
┌──────────────────┐
│   Frontend       │
│   (React)        │
│                  │
│  • Validates     │
│  • Sanitizes     │
│  • No secrets    │
└──────┬───────────┘
       │
       │ HTTPS POST
       │ JWT Token (Admin)
       │
       ▼
┌──────────────────┐
│   Backend        │
│   (Node/Python)  │
│                  │
│  1. Validate JWT │
│  2. Sanitize     │
│  3. Rate Limit   │
│  4. Verify       │
│     Signature    │
└──────┬───────────┘
       │
       ├────────────┬──────────────┐
       │            │              │
       ▼            ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│PostgreSQL│  │Razorpay  │  │   S3     │
│          │  │  API     │  │          │
│• Encrypted│  │• HTTPS  │  │• Private │
│• Backups │  │• Signed │  │• Signed  │
│          │  │  Calls  │  │  URLs    │
└──────────┘  └──────────┘  └──────────┘
```

---

## 📈 Scalability Considerations

```
┌─────────────────────────────────────┐
│         Current Design              │
│       (0-1000 donations/day)        │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Scale to 10,000 donations/day     │
│                                     │
│  Add:                               │
│  • Redis caching                    │
│  • Database read replicas           │
│  • CDN for static assets            │
│  • Background job queue (Bull)      │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Scale to 100,000 donations/day    │
│                                     │
│  Add:                               │
│  • Load balancer                    │
│  • Multiple app servers             │
│  • Database sharding                │
│  • Separate email service           │
│  • Microservices architecture       │
└─────────────────────────────────────┘
```

---

**Last Updated**: February 12, 2026  
**Version**: 1.0  
**Status**: Ready for Implementation
