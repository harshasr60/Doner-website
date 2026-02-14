const db = require('../config/database');

class Donor {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM donors WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async create(donorData) {
        const { id, name, email, mobile, pan_number, is_public } = donorData;
        const query = `
      INSERT INTO donors (id, name, email, mobile, pan_number, is_public)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [id, name, email, mobile, pan_number, is_public];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM donors WHERE id = $1', [id]);
        return result.rows[0];
    }
}

module.exports = Donor;
