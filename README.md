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
- Disband team

---

### 🏆 Tournament Management

#### Player Features
- View all tournaments
- Register team for tournaments
- Withdraw team from tournaments
- View joined tournaments
- View tournament details

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

---

## 📂 Project Structure

```bash
esports-platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CreateTeam.jsx
│   │   │   ├── MyTeam.jsx
│   │   │   ├── Invites.jsx
│   │   │   ├── Tournaments.jsx
│   │   │   ├── TournamentDetails.jsx
│   │   │   ├── MyTournaments.jsx
│   │   │   ├── CreateTournament.jsx
│   │   │   └── EditTournament.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── teamController.js
│   │   └── tournamentController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   └── Tournament.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── teamRoutes.js
│   │   └── tournamentRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/YOUR_USERNAME/esports-platform.git
cd esports-platform
2. Backend Setup
cd server
npm install

Create .env inside server/

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run backend:

npm run dev

If npm run dev doesn't work:

npm start
3. Frontend Setup

Open a new terminal:

cd client
npm install
npm run dev
🔐 Environment Variables

Create a .env file inside server/

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
👑 User Roles
Player

Can:

Register / Login
Create team
Invite players
Accept / reject invites
Leave team
Join tournaments
Withdraw from tournaments
View tournament details
Manage own team
Captain

Additional permissions:

Remove team members
Transfer captaincy
Disband team
Admin

Can:

Create tournaments
Edit tournaments
Delete tournaments
Manage tournament progression
Update match results
Control tournament lifecycle
🔌 API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/dashboard-stats
Teams
POST   /api/teams/create
GET    /api/teams/all
GET    /api/teams/my-team
POST   /api/teams/invite
GET    /api/teams/invites
POST   /api/teams/accept-invite
POST   /api/teams/reject-invite
GET    /api/teams/search-players
DELETE /api/teams/remove-member/:memberId
POST   /api/teams/leave
POST   /api/teams/transfer-captain
DELETE /api/teams/disband
Tournaments
POST   /api/tournaments/create
GET    /api/tournaments/all
GET    /api/tournaments/my-tournaments
GET    /api/tournaments/:id
POST   /api/tournaments/register
POST   /api/tournaments/withdraw
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
PUT    /api/tournaments/:id/match/:matchNumber
🎯 Core Workflows
Team Workflow
Player registers
Creates team
Captain searches players
Sends invitations
Players accept/reject
Captain manages members
Captain transfers leadership if leaving
Team joins tournaments

Tournament Workflow
Admin creates tournament
Players browse tournaments
Teams register
Admin manages tournament progress
Match results updated
Players view joined tournaments
🚀 Future Improvements
Live tournament bracket system
Match history snapshots
Real-time notifications
Player profile pages
Team logos / banners
Leaderboards
Live chat
Email notifications
Payment integration
Match scheduling
Real-time multiplayer updates