Paradise Hotel - Web Application

This project is a complete React-based frontend application and an Express/SQLite backend for the fictional "Paradise Hotel" brand.


1. Starting the Backend
The backend must be running for the frontend to communicate with the API. The API starts at `http://localhost:4000`.

Option A: Run with Docker (Recommended)
bash
cd Backend
docker compose up --build

Option B: Run Locally (Node.js)
bash
cd Backend
npm install
npm run dev

2. Starting the Frontend
The frontend is built with React and Vite. It runs on http://localhost:5173.

Open a new terminal window and run:
bash
cd Frontend
npm install
npm run dev

3. Test Credentials
To test the role-based authorization, you can use the following accounts:

Admin Account: admin@paradise.local / Admin123!
Guest Account: Please register a new user account via the "Sign Up" page on the frontend.