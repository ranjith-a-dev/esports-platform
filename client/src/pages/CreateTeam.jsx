import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await API.post("/teams/create", { teamName }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Team created successfully");

      setTimeout(() => {
        navigate("/my-team");
      }, 1000);
    } catch (error) {
      toast.success(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#020408", fontFamily: "'Exo 2', sans-serif" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div
        className="relative w-full max-w-130 rounded-[20px] p-10"
        style={{
          background: "rgba(6,12,20,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(168,85,247,0.2)",
          boxShadow: "0 0 30px rgba(168,85,247,0.15), 0 0 80px rgba(124,58,237,0.08)",
        }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/60 rounded-tl-xl" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/60 rounded-tr-xl" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500/60 rounded-bl-xl" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/60 rounded-br-xl" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative p-4 rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))",
              border: "1px solid rgba(168,85,247,0.4)",
              color: "#a855f7",
            }}
          >
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1
            className="text-[22px] font-black tracking-[2px] uppercase bg-clip-text text-transparent"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              backgroundImage: "linear-gradient(135deg,#f0f4ff,#a855f7)",
            }}
          >
            CREATE YOUR TEAM
          </h1>
          <p className="text-[13px] mt-1.5 tracking-wide" style={{ color: "rgba(148,163,184,0.7)" }}>
            Become a captain and build your esports squad
          </p>
          <div className="w-16 h-0.5 mt-3" style={{ background: "linear-gradient(90deg,transparent,#7c3aed,transparent)" }} />
        </div>

        {/* Input */}
        <div className="mb-5">
          <label className="block text-[11px] font-semibold tracking-[1.5px] uppercase mb-1.5" style={{ color: "rgba(168,85,247,0.8)" }}>
            Team Name
          </label>
          <div className="relative group">
            <Users
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ color: "rgba(148,163,184,0.5)" }}
            />
            <input
              type="text"
              placeholder="Enter your team name..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none transition-all duration-300"
              style={{
                background: "rgba(6,12,20,0.8)",
                border: "1px solid rgba(100,116,139,0.3)",
                color: "#f0f4ff",
                fontFamily: "'Exo 2', sans-serif",
                letterSpacing: "0.3px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(168,85,247,0.7)";
                e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.12)";
                e.target.style.background = "rgba(10,22,40,0.9)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(100,116,139,0.3)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(6,12,20,0.8)";
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateTeam}
          disabled={loading}
          className="w-full py-4 rounded-xl text-[15px] font-bold tracking-[1.5px] uppercase transition-all duration-300 flex items-center justify-center gap-2 mb-6"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#a855f7,#7c3aed)",
            backgroundSize: "200% auto",
            color: "#f0f4ff",
            fontFamily: "'Exo 2', sans-serif",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(124,58,237,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              CREATING TEAM...
            </>
          ) : (
            <>
              <Zap size={16} fill="currentColor" />
              CREATE TEAM
            </>
          )}
        </button>

        {/* Captain Rules */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(168,85,247,0.15)",
          }}
        >
          <p className="text-[11px] font-semibold tracking-[1.5px] uppercase mb-3" style={{ color: "rgba(168,85,247,0.8)" }}>
            Captain Rules
          </p>
          {[
            "One player can own only one team",
            "Captain manages invites and roster",
            "Team members join only via invite",
          ].map((rule) => (
            <div key={rule} className="flex items-center gap-2 mb-2">
              <ChevronRight size={13} style={{ color: "#a855f7", flexShrink: 0 }} />
              <span className="text-[13px]" style={{ color: "rgba(148,163,184,0.7)" }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default CreateTeam;