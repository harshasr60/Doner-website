const Donor = require('../models/Donor');
const db = require('../config/database');

exports.getDonorWall = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.name, 
                d.is_public, 
                don.amount, 
                don.donation_date as date
            FROM donations don
            JOIN donors d ON don.donor_id = d.id
            WHERE don.payment_status = 'success'
            ORDER BY don.amount DESC
        `;
        const result = await db.query(query);

        // Transform data for frontend
        const donors = result.rows.map(row => ({
            id: row.id, // We might need to select id if we want a key, but row.id is missing in select
            name: row.is_public ? row.name : `Donor`,
            amount: parseFloat(row.amount),
            date: row.date,
            isPublic: row.is_public
        }));

        res.json(donors);
    } catch (error) {
        console.error('Error fetching donor wall:', error);
        res.status(500).json({ error: 'Failed to fetch donors' });
    }
};
