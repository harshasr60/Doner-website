const cron = require('node-cron');
const Donation = require('../models/Donation');
const ProgressReport = require('../models/ProgressReport');
const Program = require('../models/Program');
const emailService = require('../services/emailService');
const db = require('../config/database');

// Schedule tasks to be run on the server.
cron.schedule('0 9 * * *', async () => {
    console.log('Running 7-day progress report job...');
    try {
        // Logic to find donations that need a report
        // This is complex as we need to track when the last report was sent or calculate days since donation.
        // For simplicity, let's assume we check all active donations.

        // We need a way to get active donations.
        // "Active" means: Program is not completed (or just simply based on time for now).

        // Fetch all successful donations (naive approach)
        // Ideally we should filter in SQL
        const result = await db.query(`
        SELECT d.*, p.name as program_name, don.email as donor_email, don.name as donor_name
        FROM donations d
        JOIN programs p ON d.program_id = p.id
        JOIN donors don ON d.donor_id = don.id
        WHERE d.payment_status = 'success'
    `);

        const donations = result.rows;

        for (const donation of donations) {
            const donationDate = new Date(donation.donation_date);
            const today = new Date();
            const diffTime = Math.abs(today - donationDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Check if today is a 7th day (7, 14, 21...)
            if (diffDays > 0 && diffDays % 7 === 0) {
                console.log(`Sending report for donation ${donation.id} (Day ${diffDays})`);

                // Create dummy report content or fetch from somewhere
                const reportContent = `This is your ${diffDays}-day progress report for ${donation.program_name}.`;

                const reportData = {
                    id: `REP${Date.now()}_${donation.id}`,
                    donation_id: donation.id,
                    program_id: donation.program_id,
                    report_date: new Date(),
                    content: reportContent,
                    images_json: '[]',
                    sent_at: new Date()
                };

                await ProgressReport.create(reportData);

                await emailService.sendEmail(
                    donation.donor_email,
                    `Progress Update: ${donation.program_name}`,
                    reportContent,
                    `<p>Dear ${donation.donor_name},</p><p>${reportContent}</p>`
                );
            }
        }
    } catch (error) {
        console.error('Cron Job Error:', error);
    }
});
