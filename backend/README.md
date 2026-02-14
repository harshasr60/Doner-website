# Backend - WOMBTO18 Nonprofit Donation Platform

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Database Setup**:
    - Ensure PostgreSQL is running.
    - Create a database (e.g., `wombto18_db`).
    - Run the schema script:
      ```bash
      npm run init-db
      ```
      (You need to add this script to package.json: `"init-db": "node src/scripts/initDb.js"`)

3.  **Environment Variables**:
    - Update `.env` with your credentials.

4.  **Run Server**:
    ```bash
    npm start
    ```
    Server runs on `http://localhost:5000`.

## API Endpoints

- `POST /api/donations/create`: Create a donation order.
- `POST /api/donations/verify`: Verify payment.
- `GET /api/programs`: List programs.
- `GET /api/reports/donation/:donationId`: Get progress reports.
