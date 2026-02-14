const db = require('../config/database');

class ProgressReport {
    static async create(reportData) {
        const {
            id, donation_id, program_id, report_date, content, images_json, sent_at
        } = reportData;

        const query = `
      INSERT INTO progress_reports (
        id, donation_id, program_id, report_date, content, images_json, sent_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            id, donation_id, program_id, report_date, content, images_json, sent_at
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByDonationId(donationId) {
        const result = await db.query('SELECT * FROM progress_reports WHERE donation_id = $1', [donationId]);
        return result.rows;
    }
}

module.exports = ProgressReport;
