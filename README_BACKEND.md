# Backend Integration Complete - Next Steps

## 1. Database Setup (Action Required)
You must update `backend/.env` with your actual PostgreSQL connection string.
1. Install PostgreSQL if not installed.
2. Create a database (e.g., `wombto18_db`).
3. Update `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres::password@localhost:5432/wombto18_db
   ```
4. Initialize the database schema:
   ```bash
   cd backend
   npm run init-db
   ```

## 2. Running the Application
### Backend
Start the backend server:
```bash
cd backend
npm start
```

### Frontend
Start the React frontend:
```bash
npm run dev
```

## 3. Features Implemented
- **Donation API**: Integration with Razorpay for payments.
- **Certificates**: 80G and 12A certificates generated automatically.
- **Reports**: 7-day automated progress reporting via Email (cron job).
- **Transparency**: Backend structure tailored for transparency.

## 4. Frontend Integration
The frontend `Donate.tsx` page has been updated to call the backend APIs instead of mock logic.

## 5. Troubleshooting
If you see `ECONNREFUSED` connection errors, it means the backend cannot connect to your PostgreSQL database. Please ensure Postgres service is running.
