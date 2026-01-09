# Finance Tracker
A full-stack finance tracking application with AI-powered insights.

## Features

- 🔐 User authentication (Register/Login)
- 💰 Transaction management (Income/Expense)
- 📊 Financial dashboard with balance tracking
- 🤖 AI-powered financial questions

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Axios
- Tailwind CSS

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API

## Setup

### Prerequisites
- Node.js 
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd finance_tracker
```

2. Install dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd client
npm install

# Backend dependencies
cd ../server
npm install
```

3. Configure environment variables
```bash
# Create .env file in server directory
touch server/.env

# Add the following environment variables to server/.env:
# MONGO_URI=mongodb://localhost:27017/finance_tracker
# JWT_SECRET=your_jwt_secret_key_here
# OPENAI_API_KEY=your_openai_api_key_here
# CLIENT_URL=http://localhost:5173 (optional)
# PORT=5000 (optional)
```

4. Start MongoDB
```bash
# Make sure MongoDB is running on your system
```

5. Start the development servers

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

6. Open your browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Transactions
- `GET /transactions` - Get user transactions (requires auth)
- `POST /transactions` - Create transaction (requires auth)
- `DELETE /transactions/:id` - Delete transaction (requires auth)

### AI
- `POST /ai/ask` - Ask AI question (requires auth)

## Environment Variables

See `.env.example` for required environment variables.
