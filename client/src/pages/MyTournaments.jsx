import { useEffect, useState } from "react";
import { Trophy, Users, IndianRupee, LogOut, Gamepad2, CalendarClock, ShieldAlert } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  upcoming:  { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  color: "#60a5fa",  label: "UPCOMING"  },
  ongoing:   { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   color: "#4ade80",  label: "LIVE"      },
  completed: { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.3)", color: "#94a3b8",  label: "COMPLETED" },
};

const inputStyle = {
  width: "100%",
  background: "rgba(6,12,20,0.85)",
  border: "1px solid rgba(168,85,247,0.2)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#f0f4ff",
  fontFamily: "'Exo 2', sans-serif",
  fontSize: "13px",
  outline: "none",
  backdropFilter: "blur(12px)",
  boxShadow: "0 0 12px rgba(124,58,237,0.04)",
};

function MyTournaments() {
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchMyTournaments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tournaments/my-tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTournaments(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load your tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyTournaments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleWithdraw = async (tournamentId) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw from this tournament?"
    );
    if (!confirmWithdraw) return;

    try {
      await API.post(
        "/tournaments/withdraw",
        { tournamentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Successfully withdrawn from tournament");
      fetchMyTournaments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    }
  };

  const filteredTournaments = myTournaments.filter((tournament) => {
    const matchesSearch = tournament.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="min-h-screen px-6 py-10 relative"
      style={{ background: "#020408", fontFamily: "'Exo 2', sans-serif" }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(124,58,237,0.12)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(10,22,40,0.8) 60%,rgba(6,182,212,0.08) 100%)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <span
            className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-2xl"
            style={{ borderColor: "rgba(168,85,247,0.5)" }}
          />
          <span
            className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-2xl"
            style={{ borderColor: "rgba(168,85,247,0.5)" }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.15))",
                  border: "1px solid rgba(168,85,247,0.4)",
                  color: "#a855f7",
                }}
              >
                <Trophy size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-[11px] font-semibold tracking-[2px] uppercase mb-1"
                  style={{ color: "rgba(168,85,247,0.7)" }}
                >
                  {user?.username || "Player"}
                </p>
                <h1
                  className="text-[24px] font-black tracking-wide bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    backgroundImage: "linear-gradient(135deg,#f0f4ff,#a855f7)",
                  }}
                >
                  MY TOURNAMENTS
                </h1>
                <p
                  className="text-[13px] mt-1"
                  style={{ color: "rgba(148,163,184,0.6)" }}
                >
                  Tournaments you have registered for
                </p>
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-xl text-[12px] font-semibold tracking-[1px] uppercase"
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.25)",
                color: "#a855f7",
              }}
            >
            FREE FIRE MAX
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search tournament..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All matches</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            className="rounded-2xl p-14 text-center"
            style={{
              background: "rgba(6,12,20,0.8)",
              border: "1px solid rgba(168,85,247,0.12)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.2)",
                color: "rgba(168,85,247,0.5)",
              }}
            >
              <CalendarClock size={32} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <p
              className="text-[14px] tracking-widest uppercase"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              Loading your tournaments...
            </p>
          </div>
        ) : myTournaments.length === 0 ? (
          /* Empty State */
          <div
            className="rounded-2xl p-14 text-center"
            style={{
              background: "rgba(6,12,20,0.8)",
              border: "1px solid rgba(168,85,247,0.12)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.2)",
                color: "rgba(168,85,247,0.5)",
              }}
            >
              <ShieldAlert size={32} strokeWidth={1.5} />
            </div>
            <h2
              className="text-[18px] font-bold mb-2"
              style={{ color: "#f0f4ff", fontFamily: "'Orbitron', sans-serif" }}
            >
              NO REGISTRATIONS YET
            </h2>
            <p
              className="text-[14px] mb-6"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              You haven&apos;t registered for any tournaments yet.
            </p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          /* No filter results */
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "rgba(6,12,20,0.8)",
              border: "1px solid rgba(168,85,247,0.12)",
            }}
          >
            <p
              className="text-[14px]"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              No tournaments match your search.
            </p>
          </div>
        ) : (
          /* Tournament Cards Grid */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTournaments.map((t, i) => {
              const status = STATUS_STYLES[t.status] || STATUS_STYLES.upcoming;
              const slotsUsed = t.registeredTeams?.length || 0;
              const slotsTotal = t.slots;
              const slotPct = Math.round((slotsUsed / slotsTotal) * 100);
              const canWithdraw = t.status === "upcoming";

              return (
                <div
                  key={t._id}
                  className="rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(6,12,20,0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(168,85,247,0.15)",
                    animation: `fadeSlideUp 0.4s ease forwards`,
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(124,58,237,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent,#7c3aed,#a855f7,transparent)",
                    }}
                  />    

                  {/* Game badge + Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }}
                    >
                      <Gamepad2 size={12} style={{ color: "#a855f7" }} />
                      <span
                        className="text-[11px] font-semibold tracking-wide"
                        style={{ color: "rgba(168,85,247,0.8)" }}
                      >
                        {t.game}
                      </span>
                    </div>
                    <span
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[1px] uppercase"
                      style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-[17px] font-black tracking-wide mb-4"
                    style={{
                      color: "#f0f4ff",
                      fontFamily: "'Orbitron', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name.toUpperCase()}
                  </h2>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      {
                        icon: IndianRupee,
                        label: "Prize Pool",
                        value: `₹${t.prizePool.toLocaleString()}`,
                        color: "#4ade80",
                      },
                      {
                        icon: IndianRupee,
                        label: "Entry Fee",
                        value: `₹${t.entryFee.toLocaleString()}`,
                        color: "#facc15",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="rounded-xl px-3 py-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <p
                          className="text-[10px] tracking-wide mb-1"
                          style={{ color: "rgba(148,163,184,0.5)" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-[15px] font-bold"
                          style={{ color }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Slots progress */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} style={{ color: "rgba(6,182,212,0.7)" }} />
                        <span
                          className="text-[11px]"
                          style={{ color: "rgba(148,163,184,0.5)" }}
                        >
                          Teams
                        </span>
                      </div>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: "#22d3ee" }}
                      >
                        {slotsUsed} / {slotsTotal}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${slotPct}%`,
                          background:
                            slotPct >= 90
                              ? "linear-gradient(90deg,#ef4444,#f87171)"
                              : "linear-gradient(90deg,#06b6d4,#22d3ee)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => navigate(`/tournaments/${t._id}`)}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold tracking-[1px] uppercase"
                      style={{
                        background: "rgba(6,182,212,0.12)",
                        border: "1px solid rgba(6,182,212,0.25)",
                        color: "#22d3ee",
                      }}
                    >
                      VIEW DETAILS
                    </button>

                    {canWithdraw && (
                      <button
                        onClick={() => handleWithdraw(t._id)}
                        className="flex-1 py-3 rounded-xl text-[13px] font-bold tracking-[1px] uppercase flex items-center justify-center gap-2 transition-all duration-200"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          color: "#f87171",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.2)";
                          e.currentTarget.style.boxShadow =
                            "0 0 16px rgba(239,68,68,0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <LogOut size={13} />
                        WITHDRAW
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        select option { background: #060c14; color: #f0f4ff; }
      `}</style>
    </div>
  );
}

export default MyTournaments;