const db = require('../config/database');

class Donation {
    static async create(donationData) {
        const {
            id, donor_id, program_id, amount, razorpay_order_id,
            payment_status, transaction_id
        } = donationData;

        const query = `
      INSERT INTO donations (
        id, donor_id, program_id, amount, razorpay_order_id,
        payment_status, transaction_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            id, donor_id, program_id, amount, razorpay_order_id,
            payment_status, transaction_id
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async updatePaymentStatus(id, updateData) {
        const { razorpay_payment_id, razorpay_signature, payment_status } = updateData;
        const query = `
      UPDATE donations
      SET 
        razorpay_payment_id = $1,
        razorpay_signature = $2,
        payment_status = $3,
        donation_date = NOW()
      WHERE id = $4
      RETURNING *
    `;
        const values = [razorpay_payment_id, razorpay_signature, payment_status, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM donations WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async updateCertificates(id, cert80g, cert12a) {
        const query = `
      UPDATE donations
      SET certificate_80g_url = $1, certificate_12a_url = $2
      WHERE id = $3
      RETURNING *
    `;
        const result = await db.query(query, [cert80g, cert12a, id]);
        return result.rows[0];
    }
}

module.exports = Donation;
