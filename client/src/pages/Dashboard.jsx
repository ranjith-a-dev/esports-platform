import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Mail,
  PlusCircle,
  Trophy,
  LogOut,
  ShieldCheck,
  Gamepad2,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [inviteCount, setInviteCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const playerLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
    { to: "/create-team", icon: PlusCircle, label: "Create Team" },
    { to: "/invites", icon: Mail, label: "Pending Invites" },
    { to: "/my-tournaments", icon: History, label: "My Tournaments" },
  ];

  const adminLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
    { to: "/create-tournament", icon: PlusCircle, label: "Create Tournament" },
    { to: "/tournaments", icon: ShieldCheck, label: "Manage Tournaments" },
  ];

  useEffect(() => {
  const fetchInviteCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/teams/invites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInviteCount(res.data.length || 0);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (!isAdmin) {
    fetchInviteCount();
  }
}, [isAdmin]);

  const navLinks = isAdmin ? adminLinks : playerLinks;

  const playerCards = [
    {
      to: "/my-team",
      icon: Users,
      label: "My Team",
      desc: "Manage your squad",
      color: "cyan",
      glow: "rgba(6,182,212,0.5)",
      iconColor: "#22d3ee",
      border: "rgba(6,182,212,0.25)",
      bg: "rgba(6,182,212,0.08)",
    },
    {
      to: "/tournaments",
      icon: Trophy,
      label: "Tournaments",
      desc: "Join competitions",
      color: "green",
      glow: "rgba(34,197,94,0.5)",
      iconColor: "#4ade80",
      border: "rgba(34,197,94,0.25)",
      bg: "rgba(34,197,94,0.08)",
    },
  ];

  const adminCards = [
    {
      to: "/create-tournament",
      icon: PlusCircle,
      label: "Create Tournament",
      desc: "Launch a new esports event",
      color: "yellow",
      glow: "rgba(234,179,8,0.5)",
      iconColor: "#facc15",
      border: "rgba(234,179,8,0.25)",
      bg: "rgba(234,179,8,0.08)",
    },
    {
      to: "/tournaments",
      icon: ShieldCheck,
      label: "Manage Tournaments",
      desc: "View and control tournaments",
      color: "cyan",
      glow: "rgba(6,182,212,0.5)",
      iconColor: "#22d3ee",
      border: "rgba(6,182,212,0.25)",
      bg: "rgba(6,182,212,0.08)",
    },
  ];

  const cards = isAdmin ? adminCards : playerCards;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#020408", fontFamily: "'Exo 2', sans-serif" }}
    >
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      {/* ── Sidebar ── */}
      <aside
        className="w-65 shrink-0 flex flex-col justify-between py-8 px-5 relative z-10"
        style={{
          background: "rgba(6,12,20,0.9)",
          borderRight: "1px solid rgba(168,85,247,0.12)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-10 px-1">
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#a855f7",
              }}
            >
              <Trophy size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1
                className="text-[15px] font-black tracking-[1.5px] uppercase"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  background: "linear-gradient(135deg,#f0f4ff,#a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ESPORTS
              </h1>
              <p className="text-[11px] tracking-widest uppercase" style={{ color: "rgba(148,163,184,0.5)" }}>
                ARENA
              </p>
            </div>
          </div>

          {/* Role badge */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-6"
            style={{
              background: isAdmin
                ? "rgba(250,204,21,0.08)"
                : "rgba(168,85,247,0.08)",
              border: `1px solid ${isAdmin ? "rgba(250,204,21,0.2)" : "rgba(168,85,247,0.2)"}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isAdmin ? "#facc15" : "#a855f7",
                boxShadow: `0 0 6px ${isAdmin ? "#facc15" : "#a855f7"}`,
              }}
            />
            <span
              className="text-[11px] font-semibold tracking-[1.5px] uppercase"
              style={{ color: isAdmin ? "#facc15" : "#a855f7" }}
            >
              {isAdmin ? "Admin Panel" : `Player · ${user?.inGameName || "Unknown"}`}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, icon: Icon, label, active }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-200"
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.1))",
                        border: "1px solid rgba(168,85,247,0.3)",
                        color: "#c4b5fd",
                        boxShadow: "0 0 12px rgba(168,85,247,0.1)",
                      }
                    : {
                        border: "1px solid transparent",
                        color: "rgba(148,163,184,0.7)",
                      }
                }
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(168,85,247,0.06)";
                    e.currentTarget.style.color = "#c4b5fd";
                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(148,163,184,0.7)";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
              <Icon size={17} strokeWidth={1.5} />
                <div className="flex">
                  <span>{label}</span>

                  {label === "Pending Invites" && inviteCount > 0 && (
                  <span
                    className="ml-2 text-[12px] font-bold animate-pulse"
                    style={{
                      color: "#ef4444",
                      textShadow: "0 0 8px rgba(239,68,68,0.8)",
                    }}
                  >
                    !!
                  </span>
                )}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-200 w-full"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "rgba(248,113,113,0.8)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "rgba(248,113,113,0.8)";
          }}
        >
          <LogOut size={17} strokeWidth={1.5} />
          Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">

        {/* Hero Banner */}
        <div
          className="relative rounded-2xl p-8 mb-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(10,22,40,0.8) 50%,rgba(168,85,247,0.1) 100%)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          {/* Decorative glow orb */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-purple-500/50 rounded-tl-2xl" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-500/50 rounded-br-2xl" />

          <div className="relative flex items-center gap-4">
            <div
              className="p-3 rounded-xl shrink-0"
              style={{
                background: "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(168,85,247,0.2))",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#a855f7",
              }}
            >
              {isAdmin ? (
                <ShieldCheck size={28} strokeWidth={1.5} />
              ) : (
                <Gamepad2 size={28} strokeWidth={1.5} />
              )}
            </div>

            <div>
              <p
                className="text-[11px] font-semibold tracking-[2px] uppercase mb-1"
                style={{ color: "rgba(168,85,247,0.7)" }}
              >
                {isAdmin ? "Admin Control Center" : "Player Dashboard"}
              </p>
              <h1
                className="font-black text-[28px] tracking-wide"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  background: "linear-gradient(135deg,#f0f4ff 40%,#a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                {isAdmin ? "Welcome, Admin 👑" : `Welcome back, ${user?.inGameName || "Player"} 🎮`}
              </h1>
              <p className="mt-2 text-[14px]" style={{ color: "rgba(148,163,184,0.7)" }}>
                {isAdmin
                  ? "Create and manage esports tournaments from your control panel."
                  : "Manage your squad, check invites, and dominate the competition."}
              </p>
            </div>
          </div>

          {/* Stats row — player only */}
          
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#7c3aed,#a855f7)" }} />
          <p
            className="text-[11px] font-semibold tracking-[2px] uppercase"
            style={{ color: "rgba(168,85,247,0.7)" }}
          >
            Quick Actions
          </p>
        </div>

        {/* Action Cards */}
        <div className={`grid gap-5 ${isAdmin ? "grid-cols-2" : "grid-cols-2 xl:grid-cols-2"}`}>
          {cards.map(({ to, icon: Icon, label, desc, glow, iconColor, border, bg }) => (
            <Link
              key={to}
              to={to}
              className="group relative rounded-2xl p-6 transition-all duration-300 block"
              style={{
                background: "rgba(6,12,20,0.8)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(12px)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 24px ${glow.replace("0.5", "0.3")}, 0 8px 32px rgba(0,0,0,0.4)`;
                e.currentTarget.style.background = bg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "rgba(6,12,20,0.8)";
              }}
            >
              {/* Corner accent */}
              <span
                className="absolute top-0 right-0 w-12 h-12 rounded-bl-2xl rounded-tr-2xl opacity-20"
                style={{ background: `radial-gradient(circle at top right, ${iconColor}, transparent)` }}
              />

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${bg}`,
                  border: `1px solid ${border}`,
                  color: iconColor,
                }}
              >
                <Icon size={22} strokeWidth={1.5} />
              </div>

              <h3
                className="text-[15px] font-bold mb-1.5 tracking-wide"
                style={{ color: "#f0f4ff" }}
              >
                {label}
              </h3>
              <p className="text-[13px]" style={{ color: "rgba(148,163,184,0.6)" }}>
                {desc}
              </p>

              <div
                className="flex items-center gap-1 mt-4 text-[12px] font-semibold tracking-wide transition-all duration-200"
                style={{ color: iconColor, opacity: 0.7 }}
              >
                Open
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default Dashboard;