import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTeam from "./pages/CreateTeam";
import MyTeam from "./pages/MyTeam";
import Invites from "./pages/Invites";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import TournamentDetails from "./pages/TournamentDetails";
import EditTournament from "./pages/EditTournament";
import MyTournaments from "./pages/MyTournaments";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{
          top: 18,
        }}
        toastOptions={{
          duration: 2600,

          style: {
            background: "rgba(10, 8, 24, 0.92)",
            color: "#f8faff",
            border: "1px solid rgba(168,85,247,0.28)",
            borderRadius: "16px",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            padding: "12px 16px",
            minWidth: "280px",
            maxWidth: "360px",
            boxShadow: `
              0 0 14px rgba(168,85,247,0.14),
              0 0 28px rgba(124,58,237,0.08)
            `,
          },

          success: {
            style: {
              border: "1px solid rgba(34,211,238,0.25)",
              boxShadow: `
                0 0 14px rgba(34,211,238,0.10),
                0 0 24px rgba(168,85,247,0.08)
              `,
            },
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#0a0818",
            },
          },

          error: {
            style: {
              border: "1px solid rgba(248,113,113,0.22)",
              boxShadow: `
                0 0 12px rgba(248,113,113,0.08)
              `,
            },
            iconTheme: {
              primary: "#f87171",
              secondary: "#0a0818",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/my-team" element={<MyTeam />} />
        <Route path="/invites" element={<Invites />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
        <Route path="/edit-tournament/:id" element={<EditTournament />} />
        <Route path="/my-tournaments" element={<MyTournaments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;