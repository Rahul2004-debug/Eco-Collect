Eco-Collect


Eco-Collect is an e-waste management platform that helps users schedule pickups for their electronic waste and learn about proper e-waste disposal.

Features
User Registration and Authentication
E-Waste Pickup Request Management
Educational Resources about E-Waste
Admin Dashboard for Request Management
Real-time Status Updates
Tech Stack
Frontend
React.js
Tailwind CSS
Axios for API calls
Backend
Node.js
Express.js
MongoDB
Mongoose
Project Structure
eco-collect/
├── backend/
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── index.js        # Server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── App.jsx         # Main App component
    │   └── index.jsx       # Entry point
    └── package.json
API Endpoints
Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
Pickup Requests
POST /api/pickup - Create a new pickup request
GET /api/pickup/my-requests - Get user's pickup requests
GET /api/pickup/:id - Get a specific pickup request
PATCH /api/pickup/:id/status - Update pickup request status
Your Name - Rahul Mail-rahulhadpad05@gmail.com
