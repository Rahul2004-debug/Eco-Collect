# Eco-Collect

Eco-Collect is an e-waste management platform that helps users schedule pickups for their electronic waste and learn about proper e-waste disposal.

![image](https://github.com/user-attachments/assets/7ae7f02e-8111-4f68-bd2f-e93949ebb501)
![image](https://github.com/user-attachments/assets/29e0bd8e-ea22-48cd-91e2-4197ddac2b4d)
![image](https://github.com/user-attachments/assets/48399858-3e9c-4da6-8da1-4067f29428e2)
![image](https://github.com/user-attachments/assets/351987c0-73f4-4407-99d7-42f868b544c3)
![image](https://github.com/user-attachments/assets/96513a6a-3d52-4f1d-a889-8ac947bce1ba)
![image](https://github.com/user-attachments/assets/74874542-bf85-4e1b-b34b-1dbb2577c503)
![image](https://github.com/user-attachments/assets/551d5107-638b-47ed-8b60-3c2a4235bc7f)

## Features

- User Registration and Authentication
- E-Waste Pickup Request Management
- Educational Resources about E-Waste
- Admin Dashboard for Request Management
- Real-time Status Updates

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose


## Project Structure

```
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
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Pickup Requests
- `POST /api/pickup` - Create a new pickup request
- `GET /api/pickup/my-requests` - Get user's pickup requests
- `GET /api/pickup/:id` - Get a specific pickup request
- `PATCH /api/pickup/:id/status` - Update pickup request status


Your Name - Rahul
Mail-rahulhadpad05@gmail.com
