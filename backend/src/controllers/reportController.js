const ProgressReport = require('../models/ProgressReport');

exports.getReportsByDonation = async (req, res) => {
    try {
        const reports = await ProgressReport.findByDonationId(req.params.donationId);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

exports.createReport = async (req, res) => {
    // Admin only logic should be here
    try {
        const report = await ProgressReport.create(req.body);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create report' });
    }
}
