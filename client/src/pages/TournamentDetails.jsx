import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Trophy, Gamepad2, IndianRupee, Users, Crown, ShieldCheck,
  Map, Lock, Clock, Swords, Zap, Eye, EyeOff,
  Save, AlertCircle, CheckCircle2, BarChart3, Shield,
  ChevronDown, ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

/* ─── constants ─── */
const STATUS_CFG = {
  upcoming:  { bg:"rgba(59,130,246,0.12)",  border:"rgba(59,130,246,0.35)",  color:"#60a5fa", glow:"rgba(59,130,246,0.25)",  label:"UPCOMING", dot:"#3b82f6" },
  ongoing:   { bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.35)",  color:"#34d399", glow:"rgba(16,185,129,0.25)",  label:"● LIVE",   dot:"#10b981" },
  completed: { bg:"rgba(100,116,139,0.12)", border:"rgba(100,116,139,0.35)", color:"#94a3b8", glow:"rgba(100,116,139,0.2)",  label:"COMPLETED",dot:"#64748b" },
};
const RANK_COLORS = ["#facc15","#94a3b8","#cd7c3a"];

/* ─── helpers ─── */

// Resolve team name from entry — handles populated object OR plain string id
function resolveTeamName(entry, registeredTeams = []) {
  // If backend populated: entry.team = { _id, teamName }
  if (entry.team && typeof entry.team === "object" && entry.team.teamName) {
    return entry.team.teamName;
  }
  // If backend sent only id string, look up from registeredTeams
  const teamId = entry.team?._id || entry.team;
  if (teamId && registeredTeams.length) {
    const found = registeredTeams.find(t => t._id === teamId || t._id?.toString() === teamId?.toString());
    if (found?.teamName) return found.teamName;
  }
  return null;
}

function resolveTeamId(entry) {
  if (entry.team && typeof entry.team === "object") return entry.team._id;
  return entry.team;
}

const sortLeaderboard = (arr) =>
  [...arr].sort((a, b) =>
    (b.totalPoints    ?? 0) - (a.totalPoints    ?? 0) ||
    (b.matchWins      ?? 0) - (a.matchWins      ?? 0) ||
    (b.kills          ?? 0) - (a.kills          ?? 0) ||
    (b.placementPoints?? 0) - (a.placementPoints?? 0)
  );

const sortStandings = (arr) =>
  [...arr].sort((a, b) =>
    b.totalPoints    - a.totalPoints    ||
    b.totalBooyahs   - a.totalBooyahs   ||
    b.totalKills     - a.totalKills     ||
    b.totalPlacement - a.totalPlacement
  );

/* ─── reusable UI ─── */
const GlowCard = ({ children, className = "", style = {}, accent = "purple" }) => {
  const A = {
    purple: { border:"rgba(168,85,247,0.2)", glow:"rgba(124,58,237,0.06)" },
    cyan:   { border:"rgba(34,211,238,0.2)", glow:"rgba(34,211,238,0.06)" },
    yellow: { border:"rgba(250,204,21,0.2)", glow:"rgba(250,204,21,0.06)" },
  }[accent] || { border:"rgba(168,85,247,0.2)", glow:"rgba(124,58,237,0.06)" };
  return (
    <div className={`rounded-2xl backdrop-blur-sm ${className}`}
      style={{ background:"linear-gradient(135deg,rgba(6,12,20,0.9),rgba(2,4,8,0.95))", border:`1px solid ${A.border}`, boxShadow:`0 0 40px ${A.glow},inset 0 1px 0 rgba(255,255,255,0.04)`, ...style }}>
      {children}
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, color = "#a855f7", accent = "purple" }) => {
  const rgb = { purple:"168,85,247", cyan:"34,211,238", yellow:"250,204,21" }[accent] || "168,85,247";
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 rounded-xl" style={{ background:`rgba(${rgb},0.1)`, border:`1px solid ${color}30` }}>
        <Icon size={17} color={color} />
      </div>
      <h2 className="text-lg font-black tracking-widest" style={{ fontFamily:"'Orbitron',sans-serif", color:"#f0f4ff" }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${color}40,transparent)` }} />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, subValue }) => (
  <div className="rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-default"
    style={{ background:"rgba(6,12,20,0.8)", border:`1px solid ${color}25`, boxShadow:`0 0 20px ${color}08` }}>
    <div className="mb-2">
      <div className="p-2 rounded-lg inline-block" style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
        <Icon size={15} color={color} />
      </div>
    </div>
    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-base font-black" style={{ color, fontFamily:"'Orbitron',sans-serif" }}>{value}</p>
    {subValue && <p className="text-[10px] text-slate-500 mt-1">{subValue}</p>}
  </div>
);

const InfoBanner = ({ icon: Icon, color, bg, border, children }) => (
  <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background:bg, border:`1px solid ${border}` }}>
    <Icon size={18} color={color} className="shrink-0 mt-0.5" />
    <p className="text-sm text-slate-300 leading-relaxed">{children}</p>
  </div>
);

const EmptyState = ({ icon: Icon, msg }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="p-5 rounded-2xl mb-4" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
      <Icon size={26} color="#334155" />
    </div>
    <p className="text-slate-500 text-sm max-w-xs">{msg}</p>
  </div>
);

/* ─── Loading ─── */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#020408" }}>
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Trophy size={48} color="#a855f7" />
          <div className="absolute inset-0 animate-ping"
            style={{ background:"radial-gradient(circle,rgba(168,85,247,0.3),transparent)", borderRadius:"50%" }} />
        </div>
        <p className="text-slate-400 text-sm uppercase tracking-widest" style={{ fontFamily:"'Orbitron',sans-serif" }}>
          Loading Tournament
        </p>
        <div className="flex gap-1 justify-center mt-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection({ tournament, status }) {
  const fillPercent = useMemo(() =>
    Math.min(100, Math.round(((tournament.registeredTeams?.length || 0) / (tournament.slots || 1)) * 100)),
    [tournament.registeredTeams?.length, tournament.slots]
  );
  return (
    <div className="mb-8 rounded-3xl overflow-hidden relative" style={{ border:"1px solid rgba(168,85,247,0.2)" }}>
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.18) 0%,rgba(6,12,20,0.97) 60%,rgba(34,211,238,0.06) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.6),rgba(34,211,238,0.4),transparent)" }} />
      <div className="relative p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs uppercase tracking-[3px] text-purple-400" style={{ fontFamily:"'Orbitron',sans-serif" }}>Esports Tournament</span>
              <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                style={{ background:status.bg, border:`1px solid ${status.border}`, color:status.color, boxShadow:`0 0 15px ${status.glow}` }}>
                {tournament.status === "ongoing" && (
                  <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background:status.dot }} />
                )}
                {status.label}
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-3 leading-none"
              style={{ fontFamily:"'Orbitron',sans-serif", color:"#f8faff", textShadow:"0 0 40px rgba(168,85,247,0.3)" }}>
              {(tournament.name || "").toUpperCase()}
            </h1>
            <div className="flex gap-3 flex-wrap mt-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.2)" }}>
                <Gamepad2 size={13} color="#c084fc" />
                <span className="text-sm text-purple-300 font-semibold">{tournament.game}</span>
              </div>
              {tournament.selectedMaps?.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background:"rgba(34,211,238,0.06)", border:"1px solid rgba(34,211,238,0.15)" }}>
                  <Map size={13} color="#22d3ee" />
                  <span className="text-sm text-cyan-300">{m}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 max-w-sm">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Team Slots</span>
                <span className="text-purple-300 font-bold">{tournament.registeredTeams?.length || 0} / {tournament.slots || 0}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width:`${fillPercent}%`, background:"linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)" }} />
              </div>
              <p className="text-xs text-slate-600 mt-1">{fillPercent}% filled</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-115">
            <StatCard icon={IndianRupee} label="Prize Pool" value={`₹${(tournament.prizePool||0).toLocaleString()}`} color="#4ade80" />
            <StatCard icon={IndianRupee} label="Entry Fee"  value={`₹${(tournament.entryFee||0).toLocaleString()}`}  color="#facc15" />
            <StatCard icon={Users}       label="Teams"      value={`${tournament.registeredTeams?.length||0}/${tournament.slots||0}`} color="#22d3ee" />
            <StatCard icon={Map}         label="Maps"       value={tournament.numberOfMaps || 0} color="#c084fc" />
            <StatCard icon={Clock} label="Starts" color="#60a5fa"
              value={tournament.startTime ? new Date(tournament.startTime).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—"}
              subValue={tournament.startTime ? new Date(tournament.startTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : ""} />
            <StatCard icon={Clock} label="Ends" color="#f87171"
              value={tournament.endTime ? new Date(tournament.endTime).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—"}
              subValue={tournament.endTime ? new Date(tournament.endTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : ""} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Teams Tab ─── */
function TeamsTab({ tournament, userTeam }) {
  return (
    <GlowCard accent="purple" className="p-8">
      <SectionHeader icon={ShieldCheck} title="REGISTERED TEAMS" color="#a855f7" />
      {!tournament.registeredTeams?.length
        ? <EmptyState icon={Users} msg="No teams registered yet." />
        : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tournament.registeredTeams.map((team, index) => {
              const isYours = team._id === userTeam?._id;
              return (
                <div key={team._id} className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{ background:isYours?"rgba(168,85,247,0.08)":"rgba(255,255,255,0.03)", border:isYours?"1px solid rgba(168,85,247,0.35)":"1px solid rgba(255,255,255,0.07)", boxShadow:isYours?"0 0 30px rgba(168,85,247,0.1)":"none" }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                      style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.2))", color:"#c084fc" }}>
                      {(team.teamName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-white">
                          {team.teamName}
                        </p>

                        <p
                          className="text-[11px] font-black tracking-[1.2px] uppercase"
                          style={{
                            color: "gray",
                            fontFamily: "'Orbitron', sans-serif",
                            textShadow: "0 0 8px rgba(34,211,238,0.35)",
                          }}
                        >
                          SLOT #{index + 1}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <Crown size={11} color="#facc15" />
                        <p className="text-xs text-yellow-300/80">
                          {team.captain?.inGameName || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {team.members?.map(m => (
                      <div key={m._id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background:"rgba(255,255,255,0.03)" }}>
                        <Shield size={11} color="#64748b" />
                        <span className="text-sm text-slate-300">{m.inGameName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
      }
    </GlowCard>
  );
}

/* ─── Credential Card ─── */
function CredentialCard({ label, value, color, secret }) {
  const [show, setShow] = useState(!secret);
  return (
    <div className="p-5 rounded-2xl" style={{ background:`${color}08`, border:`1px solid ${color}25` }}>
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-2xl font-black tracking-wider" style={{ color, fontFamily:"'Orbitron',sans-serif" }}>
          {secret && !show ? "••••••••" : (value || "—")}
        </p>
        {secret && (
          <button onClick={() => setShow(!show)} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Room Tab ─── */
function RoomTab({ tournament, setTournament, isAdmin, isOngoing, isUpcoming, isCompleted, isRegistered, showPassword, setShowPassword, saveRoomDetails, saving, saveMsg }) {
  const roomId   = tournament.roomDetails?.roomId   || "";
  const roomPassword = tournament.roomDetails?.roomPassword || "";
  const inp = { width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(168,85,247,0.25)", borderRadius:"12px", padding:"13px 16px", color:"#f0f4ff", fontFamily:"'Exo 2',sans-serif", fontSize:"14px", fontWeight:"600", outline:"none" };
  return (
    <GlowCard accent="purple" className="p-8">
      <SectionHeader icon={Lock} title="ROOM DETAILS" color="#a855f7" />
      {isAdmin && <>
        {isUpcoming  && <InfoBanner icon={Clock}        color="#60a5fa" bg="rgba(59,130,246,0.08)"  border="rgba(59,130,246,0.2)">Room details can be posted once the tournament goes <strong className="text-blue-300">LIVE</strong>.</InfoBanner>}
        {isCompleted && <InfoBanner icon={CheckCircle2} color="#94a3b8" bg="rgba(100,116,139,0.08)" border="rgba(100,116,139,0.2)">Tournament completed. Room credentials are archived.</InfoBanner>}
        {isOngoing && <div className="space-y-5">
          <p className="text-sm text-slate-400">Manage room credentials. Players see these when match is live.</p>
          {saveMsg === "success" && <div className="flex items-center gap-2 text-green-400 text-sm p-3 rounded-xl" style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)" }}><CheckCircle2 size={15} />Saved successfully</div>}
          {saveMsg === "error"   && <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl"   style={{ background:"rgba(239,68,68,0.08)",   border:"1px solid rgba(239,68,68,0.2)"   }}><AlertCircle  size={15} />Failed to save.</div>}
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Room ID</label>
            <input type="text" placeholder="Enter Room ID..." value={roomId}
              onChange={e => setTournament(p => ({ ...p, roomDetails:{ ...p.roomDetails, roomId:e.target.value }}))}
              style={inp}
              onFocus={e => { e.target.style.borderColor="rgba(168,85,247,0.6)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e  => { e.target.style.borderColor="rgba(168,85,247,0.25)"; e.target.style.boxShadow="none"; }} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "roomPassword"} placeholder="Enter Room Password..." value={roomPassword}
                onChange={e => setTournament(p => ({ ...p, roomDetails:{ ...p.roomDetails, roomPassword:e.target.value }}))}
                style={{ ...inp, paddingRight:"52px" }}
                onFocus={e => { e.target.style.borderColor="rgba(168,85,247,0.6)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,0.1)"; }}
                onBlur={e  => { e.target.style.borderColor="rgba(168,85,247,0.25)"; e.target.style.boxShadow="none"; }} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button onClick={saveRoomDetails} disabled={saving}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105 disabled:opacity-60"
            style={{ fontFamily:"'Orbitron',sans-serif", background:"linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow:"0 0 25px rgba(168,85,247,0.3)", color:"#fff", border:"none", cursor:saving?"not-allowed":"pointer" }}>
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Room Details"}
          </button>
        </div>}
      </>}
      {!isAdmin && <>
        {isUpcoming  && <InfoBanner icon={Clock}        color="#60a5fa" bg="rgba(59,130,246,0.08)"  border="rgba(59,130,246,0.2)">Room details will be available once the match starts. Stay tuned!</InfoBanner>}
        {isCompleted && <InfoBanner icon={CheckCircle2} color="#94a3b8" bg="rgba(100,116,139,0.08)" border="rgba(100,116,139,0.2)">Tournament concluded. Room credentials are no longer active.</InfoBanner>}
        {isOngoing && !isRegistered && <InfoBanner icon={Lock} color="#f97316" bg="rgba(249,115,22,0.08)" border="rgba(249,115,22,0.2)">Only registered teams can access room details.</InfoBanner>}
        {isOngoing && isRegistered && <div className="space-y-5">
          <InfoBanner icon={CheckCircle2} color="#34d399" bg="rgba(52,211,153,0.08)" border="rgba(52,211,153,0.2)">You are registered! Here are your room credentials.</InfoBanner>
          <div className="grid sm:grid-cols-2 gap-5">
            <CredentialCard label="Room ID"  value={roomId}   color="#a855f7" />
            <CredentialCard label="Password" value={roomPassword} color="#22d3ee" secret />
          </div>
        </div>}
      </>}
    </GlowCard>
  );
}

/* ─── Manage Tab — collapsible per match ─── */
function ManageTab({ tournament, matchInputs, handleMatchChange, saveMatchResults, saveMsg }) {
  const [openMatch, setOpenMatch] = useState(null);
  const teamCount = tournament.registeredTeams?.length || 0;

  const matches = useMemo(() => {
    if (tournament.matchResults?.length) return tournament.matchResults;
    return (tournament.selectedMaps || []).map((map, i) => ({ matchNumber:i+1, mapName:map, leaderboard:[] }));
  }, [tournament.matchResults, tournament.selectedMaps]);

  const cell = { background:"rgba(0,0,0,0.45)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:"8px", padding:"9px 10px", color:"#f0f4ff", fontFamily:"'Exo 2',sans-serif", fontSize:"13px", outline:"none", width:"100%" };
  const readCell = { ...cell, background:"rgba(34,211,238,0.06)", borderColor:"rgba(34,211,238,0.2)", color:"#22d3ee", textAlign:"center", fontWeight:700, cursor:"default" };

  return (
    <GlowCard accent="purple" className="p-6">
      <SectionHeader icon={Zap} title="MATCH MANAGEMENT" color="#a855f7" />
      {saveMsg === "success" && (
        <div className="flex items-center gap-2 text-green-400 text-xs p-3 rounded-xl mb-5"
          style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)" }}>
          <CheckCircle2 size={14} /> Match results saved successfully
        </div>
      )}

      <div className="flex flex-col gap-3">
        {matches.map(match => {
          const isOpen = openMatch === match.matchNumber;
          return (
            <div key={match.matchNumber} className="rounded-xl overflow-hidden"
              style={{ border:"1px solid rgba(168,85,247,0.15)" }}>

              {/* Match header — click to expand */}
              <button className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
                style={{ background:isOpen?"rgba(168,85,247,0.12)":"rgba(6,12,20,0.8)", cursor:"pointer", border:"none" }}
                onClick={() => setOpenMatch(isOpen ? null : match.matchNumber)}
                onMouseOver={e => { if(!isOpen) e.currentTarget.style.background="rgba(168,85,247,0.07)"; }}
                onMouseOut={e  => { if(!isOpen) e.currentTarget.style.background="rgba(6,12,20,0.8)"; }}>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg font-black text-xs"
                    style={{ fontFamily:"'Orbitron',sans-serif", background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", color:"#c084fc" }}>
                    MATCH {match.matchNumber}
                  </div>
                  <span className="text-white font-semibold text-sm">{match.mapName}</span>
                </div>
                {isOpen ? <ChevronUp size={16} color="#a855f7" /> : <ChevronDown size={16} color="#64748b" />}
              </button>

              {/* Expandable content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-4" style={{ background:"rgba(4,8,14,0.6)", borderTop:"1px solid rgba(168,85,247,0.1)" }}>
                  {/* Column headers */}
                  <div className="grid gap-2 mb-3 px-1" style={{ gridTemplateColumns:"2.5fr 1fr 1fr 1fr" }}>
                    {["Team","Kills","Placement","Total"].map((h, i) => (
                      <span key={h} className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color:i===3?"#22d3ee":"rgba(100,116,139,0.7)" }}>{h}</span>
                    ))}
                  </div>

                  {/* One row per team — auto generated */}
                  {Array.from({ length: teamCount }).map((_, rowIndex) => {
                    const row = matchInputs[match.matchNumber]?.[rowIndex] || {};
                    return (
                      <div key={rowIndex} className="grid gap-2 mb-2" style={{ gridTemplateColumns:"2.5fr 1fr 1fr 1fr" }}>
                        <input
                          readOnly
                          value={tournament.registeredTeams?.[rowIndex]?.teamName || ""}
                          style={{
                            ...cell,
                            background: "rgba(255,255,255,0.03)",
                            cursor: "default",
                            color: "#f0f4ff",
                            fontWeight: 600,
                          }}
                        />
                        <input type="number" placeholder="0" value={row.kills ?? ""}
                          onChange={e => handleMatchChange(match.matchNumber, rowIndex, "kills", e.target.value)}
                          style={cell}
                          onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
                          onBlur={e  => e.target.style.borderColor = "rgba(168,85,247,0.2)"} />

                        <input type="number" placeholder="0" value={row.placementPoints ?? ""}
                          onChange={e => handleMatchChange(match.matchNumber, rowIndex, "placementPoints", e.target.value)}
                          style={cell}
                          onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
                          onBlur={e  => e.target.style.borderColor = "rgba(168,85,247,0.2)"} />

                        <input readOnly value={row.totalPoints ?? ""} placeholder="0" style={readCell} />
                      </div>
                    );
                  })}

                  <button onClick={() => saveMatchResults(match.matchNumber)}
                    className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105"
                    style={{ fontFamily:"'Orbitron',sans-serif", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff", border:"none", boxShadow:"0 0 16px rgba(168,85,247,0.25)", cursor:"pointer" }}>
                    <Save size={13} /> Save Match {match.matchNumber}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

/* ─── Results Tab — collapsible match cards ─── */
function ResultsTab({ tournament }) {
  const [openMatch, setOpenMatch] = useState(null);

  if (!tournament.matchResults?.length) {
    return (
      <GlowCard accent="cyan" className="p-8">
        <SectionHeader icon={Trophy} title="MATCH RESULTS" color="#22d3ee" accent="cyan" />
        <EmptyState icon={Swords} msg="No match results yet. Results will appear here as matches complete." />
      </GlowCard>
    );
  }

  return (
    <GlowCard accent="cyan" className="p-6">
      <SectionHeader icon={Trophy} title="MATCH RESULTS" color="#22d3ee" accent="cyan" />
      <div className="flex flex-col gap-3">
        {tournament.matchResults.map(match => {
          const isOpen  = openMatch === match.matchNumber;
          const sorted  = match.leaderboard?.length ? sortLeaderboard(match.leaderboard) : [];

          return (
            <div key={match.matchNumber} className="rounded-xl overflow-hidden"
              style={{ border:"1px solid rgba(34,211,238,0.15)" }}>

              {/* Clickable header */}
              <button className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
                style={{ background:isOpen?"rgba(34,211,238,0.08)":"rgba(6,12,20,0.8)", cursor:"pointer", border:"none" }}
                onClick={() => setOpenMatch(isOpen ? null : match.matchNumber)}
                onMouseOver={e => { if(!isOpen) e.currentTarget.style.background="rgba(34,211,238,0.04)"; }}
                onMouseOut={e  => { if(!isOpen) e.currentTarget.style.background="rgba(6,12,20,0.8)"; }}>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-3 py-1 rounded-lg font-black text-xs"
                    style={{ fontFamily:"'Orbitron',sans-serif", background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.25)", color:"#22d3ee" }}>
                    MATCH {match.matchNumber}
                  </div>
                  <span className="text-white font-semibold text-sm">{match.mapName}</span>
                </div>
                {isOpen ? <ChevronUp size={16} color="#22d3ee" /> : <ChevronDown size={16} color="#64748b" />}
              </button>

              {/* Expanded leaderboard */}
              {isOpen && (
                <div style={{ background:"rgba(4,8,14,0.7)", borderTop:"1px solid rgba(34,211,238,0.1)" }}>
                  {!sorted.length
                    ? <p className="text-slate-500 text-sm p-5">Results not posted yet.</p>
                    : <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background:"rgba(34,211,238,0.05)" }}>
                              {["Rank","Team","Booyah","Kills","Placement","Total"].map(h => (
                                <th key={h} className="text-left py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sorted.map((entry, idx) => {
                              // ── CRITICAL FIX: resolve team name from populated object OR registeredTeams lookup ──
                              const name = resolveTeamName(entry, tournament.registeredTeams);
                              return (
                                <tr key={idx} className="border-t hover:bg-white/2 transition-colors"
                                  style={{ borderColor:"rgba(255,255,255,0.04)", background:idx===0?"rgba(250,204,21,0.03)":"transparent" }}>
                                  <td className="py-3 px-4 font-bold" style={{ color:RANK_COLORS[idx]||"#475569" }}>
                                    {idx===0 ? <Crown size={14} /> : idx+1}
                                  </td>
                                  <td className="py-3 px-4 font-semibold text-white">{name || <span className="text-slate-600 text-xs italic">Unknown</span>}</td>
                                  <td className="py-3 px-4">
                                    {(entry.matchWins ?? 0) === 1
                                      ? <span className="py-3 px-4 text-yellow-200">1</span>
                                      : <span className="py-3 px-4 text-yellow-200">0</span>}
                                  </td>
                                  <td className="py-3 px-4 text-cyan-300 font-bold">{entry.kills ?? 0}</td>
                                  <td className="py-3 px-4 text-purple-300">{entry.placementPoints ?? 0}</td>
                                  <td className="py-3 px-4 font-black text-green-400" style={{ fontFamily:"'Orbitron',sans-serif" }}>{entry.totalPoints ?? 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

/* ─── Standings Tab ─── */
function StandingsTab({ overallStandings }) {
  return (
    <GlowCard accent="yellow" className="p-8">
      <SectionHeader icon={Trophy} title="OVERALL STANDINGS" color="#facc15" accent="yellow" />
      {!overallStandings.length
        ? <EmptyState icon={BarChart3} msg="Standings will appear once match results are posted." />
        : <div className="overflow-x-auto rounded-2xl" style={{ border:"1px solid rgba(250,204,21,0.1)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background:"rgba(250,204,21,0.04)" }}>
                  {["Rank","Team","Matches","Booyah","Kills","Placement","Total"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overallStandings.map((team, idx) => (
                  <tr key={idx} className="border-t hover:bg-white/2 transition-colors"
                    style={{ borderColor:"rgba(255,255,255,0.04)", background:idx===0?"rgba(250,204,21,0.04)":"transparent" }}>
                    <td className="py-3 px-4">
                      {idx===0
                        ? <div className="flex items-center gap-1.5"><Crown size={14} color="#facc15" /><span className="font-black text-yellow-400" style={{ fontFamily:"'Orbitron',sans-serif" }}>1</span></div>
                        : <span className="font-bold" style={{ color:RANK_COLORS[idx]||"#475569", fontFamily:"'Orbitron',sans-serif" }}>{idx+1}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                          style={{ background:idx===0?"rgba(250,204,21,0.15)":"rgba(168,85,247,0.1)", color:idx===0?"#facc15":"#a855f7", fontFamily:"'Orbitron',sans-serif" }}>
                          {(team.teamName||"?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{team.teamName || <span className="text-slate-600 italic text-xs">Unknown</span>}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 text-sm">{team.matchesPlayed}</td>
                    <td className="py-3 px-4">
                      {team.totalBooyahs > 0
                        ? <span className="py-3 px-4 text-yellow-200">{team.totalBooyahs}</span>
                        : <span className="py-3 px-4 text-yellow-200">0</span>}
                    </td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{team.totalKills}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{team.totalPlacement}</td>
                    <td className="py-3 px-4">
                      <span className="font-black text-green-400" style={{ fontFamily:"'Orbitron',sans-serif" }}>{team.totalPoints}</span>
                      <span className="text-xs text-slate-600 ml-1">pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </GlowCard>
  );
}

/* ─── Main Component ─── */
function TournamentDetails() {
  const { id }  = useParams();
  const token   = localStorage.getItem("token");
  const user    = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const isAdmin = user?.role === "admin";

  const [tournament,   setTournament]   = useState(null);
  const [matchInputs,  setMatchInputs]  = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");
  const [activeTab,    setActiveTab]    = useState("teams");

  const fetchTournament = useCallback(async () => {
    try {
      const res = await API.get(`/tournaments/${id}`, { headers:{ Authorization:`Bearer ${token}` }});
      setTournament({ ...res.data, roomDetails:res.data.roomDetails || { roomId:"", roomPassword:"" }});
    } catch(e) { toast.success(e.response?.data?.message || "Error loading tournament"); }
  }, [id, token]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTournament(); }, [fetchTournament]);

  const status      = useMemo(() => STATUS_CFG[tournament?.status] || STATUS_CFG.upcoming, [tournament?.status]);
  const isUpcoming  = tournament?.status === "upcoming";
  const isOngoing   = tournament?.status === "ongoing";
  const isCompleted = tournament?.status === "completed";

  const userTeam = useMemo(() => {
    if (!tournament) return null;
    return tournament.registeredTeams?.find(
      t => t.captain?._id === user?._id || t.members?.some(m => m._id === user?._id)
    ) || null;
  }, [tournament, user]);

  /* ── overallStandings: uses resolveTeamName + resolveTeamId for robust team name fix ── */
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const overallStandings = useMemo(() => {
    if (!tournament?.matchResults?.length) return [];
    const map = {};
    tournament.matchResults.forEach(match => {
      match.leaderboard?.forEach(entry => {
        const teamId   = resolveTeamId(entry);
        const teamName = resolveTeamName(entry, tournament.registeredTeams || []);
        if (!teamId) return;
        if (!map[teamId]) {
          map[teamId] = { teamName:"", matchesPlayed:0, totalBooyahs:0, totalKills:0, totalPlacement:0, totalPoints:0 };
        }
        // Always update name if we resolve a better one
        if (teamName) map[teamId].teamName = teamName;
        map[teamId].matchesPlayed  += 1;
        map[teamId].totalBooyahs   += entry.matchWins        || 0;
        map[teamId].totalKills     += entry.kills            || 0;
        map[teamId].totalPlacement += entry.placementPoints  || 0;
        map[teamId].totalPoints    += entry.totalPoints      || 0;
      });
    });
    return sortStandings(Object.values(map));
  }, [tournament?.matchResults, tournament?.registeredTeams]);

  /* ── handleMatchChange: correct Booyah + Total logic ── */
  const handleMatchChange = useCallback((matchNumber, rowIndex, field, value) => {
  setMatchInputs(prev => {
    const updated = { ...prev };

    const existing = updated[matchNumber]?.[rowIndex] || {
      team: tournament.registeredTeams?.[rowIndex]?._id,
      kills: "",
      placementPoints: "",
      totalPoints: 0,
      matchWins: 0,
    };

    const row = {
      ...existing,
      [field]: value,
    };

    const kills = Number(row.kills || 0);
    if (kills < 0) {
      toast.error("Kills cannot be negative");
      return prev;
    }
    const placement = Number(row.placementPoints || 0);
    const validPlacements = [12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    if (!validPlacements.includes(placement)) {
      toast.error("Placement point is wrong");
      return prev;
      }

    row.totalPoints = kills + placement;
    row.matchWins = placement === 12 ? 1 : 0;

    const arr = [...(updated[matchNumber] || [])];
    arr[rowIndex] = row;
    updated[matchNumber] = arr;

    return updated;
  });
}, [tournament]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const saveRoomDetails = useCallback(async () => {
    setSaving(true);
    try {
      await API.put(`/tournaments/${id}`,
        { roomId:tournament.roomDetails?.roomId || "", roomPassword:tournament.roomDetails?.roomPassword || "" },
        { headers:{ Authorization:`Bearer ${token}` }}
      );
      setSaveMsg("success");
      await fetchTournament();
    } catch { setSaveMsg("error"); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(""), 3000); }
  }, [id, token, tournament?.roomDetails, fetchTournament]);

  const saveMatchResults = useCallback(async (matchNumber) => {
    try {
      const leaderboard = tournament.registeredTeams.map((team, rowIndex) => {
        const row = matchInputs[matchNumber]?.[rowIndex] || {};

        return {
          team: team._id,
          kills: Number(row.kills || 0),
          placementPoints: Number(row.placementPoints || 0),
          totalPoints: Number(row.totalPoints || 0),
          matchWins: Number(row.placementPoints || 0) === 12 ? 1 : 0,
        };
      });
      await API.put(`/tournaments/${id}/match/${matchNumber}`,
        { leaderboard },
        { headers:{ Authorization:`Bearer ${token}` }}
      );
      setSaveMsg("success");
      await fetchTournament();
      setTimeout(() => setSaveMsg(""), 3000);
    } catch(e) { toast.success(e.response?.data?.message || "Error saving match"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, matchInputs, fetchTournament]);

  const tabs = useMemo(() => [
    "teams", "room",
    ...(isAdmin && isOngoing ? ["manage"] : []),
    "results", "standings",
  ], [isAdmin, isOngoing]);

  if (!tournament) return <LoadingScreen />;

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background:"#020408", fontFamily:"'Exo 2',sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_60%,rgba(34,211,238,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <HeroSection tournament={tournament} status={status} />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200"
              style={{
                fontFamily:"'Orbitron',sans-serif",
                background:activeTab===tab?"linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.2))":"rgba(6,12,20,0.6)",
                border:activeTab===tab?"1px solid rgba(168,85,247,0.5)":"1px solid rgba(255,255,255,0.06)",
                color:activeTab===tab?"#d8b4fe":"#64748b",
                boxShadow:activeTab===tab?"0 0 20px rgba(168,85,247,0.2)":"none",
              }}>
              {tab === "manage" ? "Manage" : tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab==="teams"    && <TeamsTab    tournament={tournament} userTeam={userTeam} />}
          {activeTab==="room"     && <RoomTab     tournament={tournament} setTournament={setTournament} isAdmin={isAdmin} isOngoing={isOngoing} isUpcoming={isUpcoming} isCompleted={isCompleted} isRegistered={!!userTeam} showPassword={showPassword} setShowPassword={setShowPassword} saveRoomDetails={saveRoomDetails} saving={saving} saveMsg={saveMsg} />}
          {activeTab==="manage"   && isAdmin && isOngoing && <ManageTab  tournament={tournament} matchInputs={matchInputs} handleMatchChange={handleMatchChange} saveMatchResults={saveMatchResults} saveMsg={saveMsg} />}
          {activeTab==="results"  && <ResultsTab  tournament={tournament} />}
          {activeTab==="standings"&& <StandingsTab overallStandings={overallStandings} />}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes live-dot{0%,100%{opacity:1}50%{opacity:0.3}}.live-dot{animation:live-dot 1.2s ease-in-out infinite}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        select option{background:#0a1628;color:#f0f4ff}
      `}</style>
    </div>
  );
}

export default TournamentDetails;