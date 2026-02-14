const db = require('../config/database');

class Program {
    static async findAll() {
        const result = await db.query('SELECT * FROM programs');
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM programs WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async incrementRaisedAmount(id, amount) {
        const query = `
      UPDATE programs
      SET raised_amount = raised_amount + $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await db.query(query, [amount, id]);
        return result.rows[0];
    }

    static async incrementUtilizedAmount(id, amount) {
        const query = `
      UPDATE programs
      SET utilized_amount = utilized_amount + $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await db.query(query, [amount, id]);
        return result.rows[0];
    }
}

module.exports = Program;
