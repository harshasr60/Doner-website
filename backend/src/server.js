const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const donationRoutes = require('./routes/donation.routes');
const programRoutes = require('./routes/program.routes');
const reportRoutes = require('./routes/report.routes');

// Initialize Cron Jobs
require('./utils/cronJobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve uploaded certificates
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/donations', donationRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/donors', require('./routes/donor.routes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
