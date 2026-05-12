# 🎮 Esports Platform

A full-stack MERN esports tournament management platform built for competitive gaming communities. Players can create teams, invite members, join tournaments, manage squads, and admins can create and control tournaments.

---

## 🚀 Features

### 👤 Authentication
- User registration
- User login with JWT authentication
- Protected routes
- Role-based access control (Player / Admin)

---

### 👥 Team Management
- Create a team
- View your team
- Search players by in-game name
- Send team invitations
- Accept / reject invitations
- Remove team members (captain only)
- Leave team (regular members)
- Transfer captaincy to another member
- Disband team (captain only)

---

### 🏆 Tournament Management

#### Player Features

- View all tournaments
- Register team for tournaments
- Withdraw team from tournaments
- View joined tournaments
- View tournament details
- View match results / leaderboards

#### Admin Features

- Create tournaments
- Edit tournaments
- Delete tournaments
- Manage tournament lifecycle
- Update match results
- Control tournament progression

---

### 🎨 Frontend UI

- Futuristic esports dashboard
- Responsive layouts
- Team management interface
- Invite notifications
- Interactive captain transfer modal
- Styled scrollable invite list
- Gaming-inspired UI design

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- CORS

---

## Installation & Setup

1. Clone Repository

```bash
git clone https://github.com/ranjith-a-dev/esports-platform.git
cd esports-platform
```

2. Backend Setup

```bash
cd server
npm install
```

3. Create .env inside server/

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4. Run backend:

```bash
npm run dev
```

5. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

---

## 🚀 Future Improvements

1. OTP based Registration / Forgot password
2. Player profile pages / Team stats
3. Team logos / Match banners
4. Email notifications for match room ID and password
5. Payment integration
6. Real-time match scheduling and prize distribution

---

## Live Demo

Frontend: https://esports-platform-fg82.vercel.app/
Backend API: https://esports-platform-beige.vercel.app/

---
