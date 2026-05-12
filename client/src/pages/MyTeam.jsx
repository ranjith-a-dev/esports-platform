import { useEffect, useState } from "react";
import { Users, Crown, Search, UserPlus, Wifi, Trash2, Skull, LogOut, ShieldCheck, X, AlertTriangle } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

// ─── Transfer Captain Modal ───────────────────────────────────────────────────
function TransferCaptainModal({ members, captain, onTransfer, onClose }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const eligible = members.filter((m) => m._id !== captain._id);

  const handleConfirm = () => {
    if (!selected) return;
    if (!confirming) { setConfirming(true); return; }
    onTransfer(selected._id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(2,4,8,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "rgba(6,12,20,0.97)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 0 60px rgba(124,58,237,0.2)",
        }}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg,transparent,#7c3aed,#a855f7,transparent)" }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(148,163,184,0.6)" }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl"
            style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)", color: "#facc15" }}>
            <ShieldCheck size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] uppercase" style={{ color: "rgba(250,204,21,0.6)" }}>
              Captain Transfer
            </p>
            <h3 className="text-[16px] font-black" style={{ color: "#f0f4ff", fontFamily: "'Orbitron', sans-serif" }}>
              TRANSFER CAPTAINCY
            </h3>
          </div>
        </div>

        <p className="text-[13px] mb-5" style={{ color: "rgba(148,163,184,0.7)" }}>
          Select a member to make the new captain. You will become a regular member and can then leave.
        </p>

        {/* Member List */}
        <div className="flex flex-col gap-2 mb-5 max-h-52 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(168,85,247,0.2) transparent" }}>
          {eligible.map((member) => (
            <button
              key={member._id}
              onClick={() => { setSelected(member); setConfirming(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200"
              style={{
                background: selected?._id === member._id ? "rgba(250,204,21,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selected?._id === member._id ? "rgba(250,204,21,0.4)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: selected?._id === member._id ? "0 0 14px rgba(250,204,21,0.15)" : "none",
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))", color: "#c4b5fd" }}>
                {member.inGameName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: "#f0f4ff" }}>{member.inGameName}</p>
                <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.4)" }}>Squad Member</p>
              </div>
              {selected?._id === member._id && (
                <Crown size={14} style={{ color: "#facc15", flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>

        {/* Confirm warning */}
        {confirming && selected && (
          <div className="flex items-start gap-2 px-3 py-3 rounded-xl mb-4"
            style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.2)" }}>
            <AlertTriangle size={14} style={{ color: "#facc15", marginTop: 1, flexShrink: 0 }} />
            <p className="text-[12px]" style={{ color: "rgba(250,204,21,0.8)" }}>
              <span className="font-bold">{selected.inGameName}</span> will become the new captain. This cannot be undone unless they transfer it back.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[12px] font-bold tracking-[1px] uppercase"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(148,163,184,0.6)" }}
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 py-3 rounded-xl text-[12px] font-bold tracking-[1px] uppercase flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: selected ? "linear-gradient(135deg,rgba(250,204,21,0.3),rgba(250,204,21,0.12))" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected ? "rgba(250,204,21,0.4)" : "rgba(255,255,255,0.06)"}`,
              color: selected ? "#facc15" : "rgba(148,163,184,0.3)",
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            <ShieldCheck size={13} />
            {confirming ? "CONFIRM TRANSFER" : "TRANSFER"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MyTeam() {
  const [team, setTeam] = useState(null);
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isCaptain = team?.captain?._id === user?._id;
  const isOnlyMember = team?.members?.length === 1;

  // ── Fetch team ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const res = await API.get("/teams/my-team", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeam(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading team");
      }
    };
    fetchMyTeam();
  }, [token]);

  // ── Search players ────────────────────────────────────────────────────────
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value.trim()) { setPlayers([]); return; }
    try {
      const res = await API.get(`/teams/search-players?query=${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ── Invite player ─────────────────────────────────────────────────────────
  const handleInvite = async (playerName) => {
    try {
      await API.post("/teams/invite", { teamId: team._id, inGameName: playerName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Invitation sent");
      setSearch(""); setPlayers([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  // ── Remove member (captain action) ────────────────────────────────────────
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this player?")) return;
    try {
      const res = await API.delete(`/teams/remove-member/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(res.data.team);
      toast.success("Player removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  // ── Disband team ──────────────────────────────────────────────────────────
  const handleDisbandTeam = async () => {
    if (!window.confirm("Disband team permanently? This cannot be undone.")) return;
    try {
      await API.delete("/teams/disband", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team disbanded");
      setTeam(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  // ── Leave team (non-captain member) ──────────────────────────────────────
  const handleLeaveTeam = async () => {
    if (!window.confirm("Leave this team? You will need an invite to rejoin.")) return;
    try {
      await API.post("/teams/leave", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("You have left the team");
      setTeam(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error leaving team");
    }
  };

  // ── Transfer captaincy ────────────────────────────────────────────────────
  const handleTransferCaptain = async (newCaptainId) => {
    try {
      const res = await API.post("/teams/transfer-captain", { newCaptainId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(res.data.team);
      setShowTransferModal(false);
      toast.success("Captaincy transferred successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    }
  };

  // ── Determine captain leave options ──────────────────────────────────────
  // Captain can disband directly only if they're the sole member
  // If there are other members, they must transfer first
  const captainCanDisband = isCaptain && isOnlyMember;
  const captainMustTransfer = isCaptain && !isOnlyMember;

  // After transferring, the old captain is now a regular member — so isCaptain
  // will be false and they'll see the Leave button automatically.

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020408" }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "rgba(168,85,247,0.5)" }}>
            <Users size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold" style={{ color: "#f0f4ff", fontFamily: "'Orbitron', sans-serif" }}>
            NO TEAM FOUND
          </h2>
          <p className="text-[13px] mt-2" style={{ color: "rgba(148,163,184,0.5)" }}>
            Create or join a team to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Transfer Captain Modal */}
      {showTransferModal && (
        <TransferCaptainModal
          members={team.members}
          captain={team.captain}
          onTransfer={handleTransferCaptain}
          onClose={() => setShowTransferModal(false)}
        />
      )}

      <div
        className="min-h-screen px-6 py-10 relative"
        style={{ background: "#020408", fontFamily: "'Exo 2', sans-serif" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(6,182,212,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="relative max-w-5xl mx-auto">

          {/* ── Team Header ─────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8 mb-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,rgba(6,182,212,0.12) 0%,rgba(10,22,40,0.8) 60%,rgba(124,58,237,0.08) 100%)",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 70%)", filter: "blur(20px)" }} />
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: "rgba(6,182,212,0.5)" }} />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: "rgba(6,182,212,0.5)" }} />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl"
                  style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.25),rgba(6,182,212,0.1))", border: "1px solid rgba(6,182,212,0.35)", color: "#22d3ee" }}>
                  <Users size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-1" style={{ color: "rgba(6,182,212,0.7)" }}>
                    Your Squad
                  </p>
                  <h1 className="text-[24px] font-black tracking-wide bg-clip-text text-transparent"
                    style={{ fontFamily: "'Orbitron', sans-serif", backgroundImage: "linear-gradient(135deg,#f0f4ff,#22d3ee)" }}>
                    {team.teamName.toUpperCase()}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown size={14} style={{ color: "#facc15" }} />
                    <span className="text-[13px]" style={{ color: "rgba(148,163,184,0.6)" }}>
                      Captain:{" "}
                      <span className="font-semibold" style={{ color: "#facc15" }}>
                        {team.captain.inGameName}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons (top-right of header) */}
              <div className="flex flex-col items-end gap-2 shrink-0">

                {/* Captain: Transfer captaincy (when other members exist) */}
                {captainMustTransfer && (
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-[1px] uppercase transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,rgba(250,204,21,0.15),rgba(250,204,21,0.06))",
                      border: "1px solid rgba(250,204,21,0.3)",
                      color: "#facc15",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(250,204,21,0.25)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <ShieldCheck size={13} />
                    TRANSFER CAPTAIN
                  </button>
                )}

                {/* Captain: Disband (only if sole member) */}
                {captainCanDisband && (
                  <button
                    onClick={handleDisbandTeam}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-[1px] uppercase transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(120,53,15,0.35))",
                      border: "1px solid rgba(251,146,60,0.22)",
                      color: "#fdba74",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(249,115,22,0.25)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Skull size={13} />
                    DISBAND TEAM
                  </button>
                )}

                {/* Captain with members: hint that they must transfer first */}
                {captainMustTransfer && (
                  <p className="text-[10px] text-right max-w-45" style={{ color: "rgba(148,163,184,0.4)" }}>
                    Transfer captaincy to leave team
                  </p>
                )}

                {/* Non-captain: Leave team */}
                {!isCaptain && (
                  <button
                    onClick={handleLeaveTeam}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-[1px] uppercase transition-all duration-200"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.28)",
                      color: "#f87171",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(239,68,68,0.25)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <LogOut size={13} />
                    LEAVE TEAM
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── Members Panel ──────────────────────────────────────────────── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(6,12,20,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(6,182,212,0.15)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#06b6d4,#22d3ee)" }} />
                  <p className="text-[11px] font-semibold tracking-[2px] uppercase" style={{ color: "rgba(6,182,212,0.8)" }}>
                    Team Members
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg text-[11px] font-semibold"
                  style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", color: "#22d3ee" }}>
                  {team.members.length} / {team.maxMembers || team.members.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {team.members.map((member, i) => {
                  const isMemberCaptain = member._id === team.captain._id;
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(6,182,212,0.05)",
                        border: `1px solid ${isMemberCaptain ? "rgba(250,204,21,0.18)" : "rgba(6,182,212,0.12)"}`,
                        animation: `fadeSlideUp 0.3s ease forwards`,
                        animationDelay: `${i * 0.06}s`,
                        opacity: 0,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = isMemberCaptain ? "rgba(250,204,21,0.35)" : "rgba(6,182,212,0.3)";
                        e.currentTarget.style.background = "rgba(6,182,212,0.08)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = isMemberCaptain ? "rgba(250,204,21,0.18)" : "rgba(6,182,212,0.12)";
                        e.currentTarget.style.background = "rgba(6,182,212,0.05)";
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold relative"
                          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))", color: "#c4b5fd" }}>
                          {member.inGameName.charAt(0).toUpperCase()}
                          {isMemberCaptain && (
                            <Crown size={10} className="absolute -top-1.5 -right-1.5"
                              style={{ color: "#facc15", filter: "drop-shadow(0 0 4px rgba(250,204,21,0.6))" }} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-semibold" style={{ color: "#f0f4ff" }}>{member.inGameName}</p>
                            {isMemberCaptain && (
                              <span className="text-[9px] font-bold tracking-[1px] px-1.5 py-0.5 rounded"
                                style={{ background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.25)", color: "#facc15" }}>
                                CAPTAIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.5)" }}>
                            {isMemberCaptain ? "Squad Leader" : "Squad Member"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Captain can remove non-captain members */}
                        {isCaptain && !isMemberCaptain && (
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-2 rounded-lg transition-all"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                            title="Remove member"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <Wifi size={12} style={{ color: "#4ade80" }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Invite Panel (captain only) ───────────────────────────────── */}
            {isCaptain && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(6,12,20,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(168,85,247,0.15)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#7c3aed,#a855f7)" }} />
                  <p className="text-[11px] font-semibold tracking-[2px] uppercase" style={{ color: "rgba(168,85,247,0.8)" }}>
                    Invite Players
                  </p>
                </div>

                {/* Search input */}
                <div className="relative mb-5">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(148,163,184,0.5)" }} />
                  <input
                    type="text"
                    placeholder="Search player IGN..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none transition-all duration-300"
                    style={{
                      background: "rgba(6,12,20,0.8)",
                      border: "1px solid rgba(100,116,139,0.3)",
                      color: "#f0f4ff",
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(168,85,247,0.7)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(100,116,139,0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* No results */}
                {players.length === 0 && search && (
                  <div className="text-center py-8">
                    <p className="text-[13px]" style={{ color: "rgba(148,163,184,0.4)" }}>No players found</p>
                  </div>
                )}

                
                  <div
                    className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scroll"
                    style={{ maxHeight: "300px" }}
                  >
                  {players.map((player) => (
                    <div key={player._id} className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                      style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.12)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold"
                          style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.15))", color: "#c4b5fd" }}>
                          {player.inGameName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold" style={{ color: "#f0f4ff" }}>{player.inGameName}</p>
                          <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.5)" }}>Available Player</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(player.inGameName)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200"
                        style={{
                          background: "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(168,85,247,0.2))",
                          border: "1px solid rgba(168,85,247,0.35)",
                          color: "#c4b5fd",
                          fontFamily: "'Exo 2', sans-serif",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(168,85,247,0.4)"; e.currentTarget.style.color = "#f0f4ff"; }}
                        onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.color = "#c4b5fd"; }}
                      >
                        <UserPlus size={14} strokeWidth={2} />
                        INVITE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
                  .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(168,85,247,0.5) transparent;
          }

          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(
              180deg,
              rgba(168,85,247,0.7),
              rgba(6,182,212,0.7)
            );
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.05);
          }

          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
              180deg,
              rgba(168,85,247,1),
              rgba(6,182,212,1)
            );
          }
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
          @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </div>
    </>
  );
}

export default MyTeam;