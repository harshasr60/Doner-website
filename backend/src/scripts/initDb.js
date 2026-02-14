const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../../../src/database-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running database schema script...');
        await pool.query(schemaSql);
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    } finally {
        await pool.end();
    }
}

initDb();
