import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trophy, IndianRupee, Users, Map, Clock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const FREE_FIRE_MAPS = ["Bermuda","Kalahari","Solara","Nexterra","Alpine","Purgatory"];

/* ─── shared styles ─── */
const baseInput = {
  width:"100%", background:"rgba(6,12,20,0.8)", border:"1px solid rgba(100,116,139,0.28)",
  borderRadius:"12px", color:"#f0f4ff", fontFamily:"'Exo 2',sans-serif",
  fontSize:"14px", outline:"none", transition:"border-color 0.2s,box-shadow 0.2s",
  letterSpacing:"0.3px", padding:"12px 14px 12px 42px",
};

const focusIn  = e => { e.target.style.borderColor="rgba(168,85,247,0.65)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,0.1)"; e.target.style.background="rgba(10,22,40,0.9)"; };
const focusOut = e => { e.target.style.borderColor="rgba(100,116,139,0.28)"; e.target.style.boxShadow="none"; e.target.style.background="rgba(6,12,20,0.8)"; };

function FieldLabel({ children }) {
  return (
    <label className="block text-[11px] font-semibold tracking-[1.5px] uppercase mb-1.5"
      style={{ color:"rgba(168,85,247,0.8)" }}>
      {children}
    </label>
  );
}

/* Icon wrapper — puts icon absolutely centered at left, input has left-padding */
function WithIcon({ icon: Icon, children }) {
  return (
    <div className="relative">
      <span className="absolute left-3.25 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
        style={{ color:"rgba(148,163,184,0.5)", zIndex:1 }}>
        <Icon size={15} strokeWidth={1.8} />
      </span>
      {children}
    </div>
  );
}

function EditTournament() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [fetching,   setFetching]   = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "" | "success" | "error"

  const [formData, setFormData] = useState({
    name:"", prizePool:"", entryFee:"", slots:12,
    numberOfMaps:1, selectedMaps:[], startTime:"", endTime:"",
  });

  /* ─── fetch ─── */
  const fetchTournament = useCallback(async () => {
    try {
      setFetching(true);
      const res = await API.get(`/tournaments/${id}`, { headers:{ Authorization:`Bearer ${token}` }});
      const t   = res.data;
      // ── CRITICAL: ensure selectedMaps is a proper array copy, never stale reference ──
      const maps = Array.isArray(t.selectedMaps) ? [...t.selectedMaps] : [];
      setFormData({
        name:        t.name       || "",
        prizePool:   t.prizePool  ?? "",
        entryFee:    t.entryFee   ?? "",
        slots:       t.slots      ?? 12,
        numberOfMaps:t.numberOfMaps ?? 1,
        selectedMaps: maps,
        startTime:   t.startTime ? new Date(t.startTime).toISOString().slice(0,16) : "",
        endTime:     t.endTime   ? new Date(t.endTime).toISOString().slice(0,16)   : "",
      });
    } catch(e) { toast.success(e.response?.data?.message || "Failed to load tournament"); }
    finally { setFetching(false); }
  }, [id, token]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTournament(); }, [fetchTournament]);

  /* ─── field change ─── */
  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]:e.target.value }));

  /* ─── numberOfMaps change: trim selectedMaps immediately ─── */
  const handleNumberOfMapsChange = e => {
    const count = Number(e.target.value);
    setFormData(p => ({
      ...p,
      numberOfMaps: count,
      // slice to new count — fixes the "6/6 but only 5 real" bug
      selectedMaps: p.selectedMaps.slice(0, count),
    }));
  };

  /* ─── map toggle: purely functional, no stale closure ─── */
  const handleMapToggle = mapName => {
    setFormData(p => {
      const already = p.selectedMaps.includes(mapName);
      if (already) {
        // deselect
        return { ...p, selectedMaps: p.selectedMaps.filter(m => m !== mapName) };
      }
      // guard: respect numberOfMaps limit
      if (p.selectedMaps.length >= Number(p.numberOfMaps)) {
        toast.success(`You can only select ${p.numberOfMaps} map(s). Deselect one first.`);
        return p; // no change
      }
      return { ...p, selectedMaps: [...p.selectedMaps, mapName] };
    });
  };

  /* ─── submit ─── */
  const handleUpdate = async () => {
    const needed = Number(formData.numberOfMaps);
    if (formData.selectedMaps.length !== needed) {
      toast.success(`Select exactly ${needed} map(s). Currently ${formData.selectedMaps.length} selected.`);
      return;
    }
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error("End time must be after start time");
      return;
    }
    try {
      setLoading(true);
      await API.put(`/tournaments/${id}`, {
        name:         formData.name,
        prizePool:    Number(formData.prizePool),
        entryFee:     Number(formData.entryFee),
        slots:        Number(formData.slots),
        numberOfMaps: Number(formData.numberOfMaps),
        selectedMaps: formData.selectedMaps,
        startTime:    formData.startTime,
        endTime:      formData.endTime,
      }, { headers:{ Authorization:`Bearer ${token}` }});
      setSaveStatus("success");
      setTimeout(() => navigate(`/tournaments/${id}`), 900);
    } catch(e) {
      setSaveStatus("error");
      toast.success(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(""), 3500);
    }
  };

  /* ─── loading ─── */
  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#020408" }}>
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Trophy size={48} color="#a855f7" />
          <div className="absolute inset-0 animate-ping" style={{ background:"radial-gradient(circle,rgba(168,85,247,0.3),transparent)", borderRadius:"50%" }} />
        </div>
        <p className="text-slate-400 text-sm uppercase tracking-widest" style={{ fontFamily:"'Orbitron',sans-serif" }}>Loading Tournament</p>
        <div className="flex gap-1 justify-center mt-4">
          {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />)}
        </div>
      </div>
    </div>
  );

  const selCount  = formData.selectedMaps.length;
  const maxMaps   = Number(formData.numberOfMaps);
  const allFilled = selCount >= maxMaps;

  return (
    <div className="min-h-screen px-6 py-10 relative" style={{ background:"#020408", fontFamily:"'Exo 2',sans-serif" }}>
      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      <div className="relative max-w-xl mx-auto">

        {/* Page header */}
        <div className="rounded-2xl p-7 mb-5 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(10,22,40,0.88) 60%,rgba(168,85,247,0.07) 100%)", border:"1px solid rgba(168,85,247,0.25)" }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)", filter:"blur(20px)" }} />
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/50 rounded-tl-2xl" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/50 rounded-br-2xl" />
          <div className="flex items-center gap-4 relative">
            <div className="p-3 rounded-xl shrink-0"
              style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.28),rgba(124,58,237,0.14))", border:"1px solid rgba(168,85,247,0.4)", color:"#a855f7" }}>
              <Trophy size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-0.5" style={{ color:"rgba(168,85,247,0.7)" }}>Admin Panel</p>
              <h1 className="text-[20px] font-black tracking-wide bg-clip-text text-transparent"
                style={{ fontFamily:"'Orbitron',sans-serif", backgroundImage:"linear-gradient(135deg,#f0f4ff,#a855f7)" }}>EDIT TOURNAMENT</h1>
              <p className="text-[12px] mt-0.5" style={{ color:"rgba(148,163,184,0.55)" }}>Update tournament details and configuration</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-[18px] p-7 relative"
          style={{ background:"rgba(6,12,20,0.88)", backdropFilter:"blur(24px)", border:"1px solid rgba(168,85,247,0.15)", boxShadow:"0 0 40px rgba(124,58,237,0.05)" }}>
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/40 rounded-tl-xl" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/40 rounded-tr-xl" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500/40 rounded-bl-xl" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/40 rounded-br-xl" />

          {/* Status banners */}
          {saveStatus==="success" && (
            <div className="flex items-center gap-2 text-green-400 text-sm p-3 rounded-xl mb-5"
              style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)" }}>
              <CheckCircle2 size={15} /> Tournament updated! Redirecting...
            </div>
          )}
          {saveStatus==="error" && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl mb-5"
              style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={15} /> Failed to update. Try again.
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Tournament Name */}
            <div>
              <FieldLabel>Tournament Name</FieldLabel>
              <WithIcon icon={Trophy}>
                <input name="name" placeholder="Tournament Name" value={formData.name} onChange={handleChange}
                  style={baseInput} onFocus={focusIn} onBlur={focusOut} />
              </WithIcon>
            </div>

            {/* Prize Pool + Entry Fee */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Prize Pool (₹)</FieldLabel>
                <WithIcon icon={IndianRupee}>
                  <input name="prizePool" type="number" placeholder="0" value={formData.prizePool} onChange={handleChange}
                    style={baseInput} onFocus={focusIn} onBlur={focusOut} />
                </WithIcon>
              </div>
              <div>
                <FieldLabel>Entry Fee (₹)</FieldLabel>
                <WithIcon icon={IndianRupee}>
                  <input name="entryFee" type="number" placeholder="0" value={formData.entryFee} onChange={handleChange}
                    style={baseInput} onFocus={focusIn} onBlur={focusOut} />
                </WithIcon>
              </div>
            </div>

            {/* Slots + Number of Maps */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Team Slots</FieldLabel>
                <WithIcon icon={Users}>
                  <input name="slots" type="number" placeholder="12" value={formData.slots} onChange={handleChange}
                    style={baseInput} onFocus={focusIn} onBlur={focusOut} />
                </WithIcon>
              </div>
              <div>
                <FieldLabel>Number of Maps</FieldLabel>
                <WithIcon icon={Map}>
                  {/* select needs appearance:none so our icon shows */}
                  <select name="numberOfMaps" value={formData.numberOfMaps} onChange={handleNumberOfMapsChange}
                    style={{ ...baseInput, appearance:"none", WebkitAppearance:"none", cursor:"pointer" }}
                    onFocus={focusIn} onBlur={focusOut}>
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n} style={{ background:"#0a1628" }}>{n} Map{n>1?"s":""}</option>
                    ))}
                  </select>
                </WithIcon>
              </div>
            </div>

            {/* Map selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>Select Maps By Order</FieldLabel>
                {/* ── CRITICAL FIX: show real selCount / maxMaps, not stale value ── */}
                <span className="text-[11px] font-semibold"
                  style={{ color: allFilled ? "rgba(52,211,153,0.8)" : "rgba(168,85,247,0.6)" }}>
                  {selCount} / {maxMaps} selected
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FREE_FIRE_MAPS.map(map => {
                  const isSelected = formData.selectedMaps.includes(map);
                  // Disabled when quota full AND this map is NOT already selected
                  const isDisabled = !isSelected && allFilled;
                  return (
                    <button key={map} type="button"
                      onClick={() => !isDisabled && handleMapToggle(map)}
                      className="py-2.5 px-3 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-150 flex items-center gap-2"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(168,85,247,0.18))"
                          : "rgba(255,255,255,0.03)",
                        border: isSelected
                          ? "1px solid rgba(168,85,247,0.55)"
                          : "1px solid rgba(255,255,255,0.07)",
                        color:   isSelected ? "#c4b5fd" : isDisabled ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.5)",
                        boxShadow: isSelected ? "0 0 10px rgba(168,85,247,0.15)" : "none",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.45 : 1,
                      }}>
                      <Map size={12} style={{ flexShrink:0, opacity:isSelected?1:0.5 }} />
                      {map}
                    </button>
                  );
                })}
              </div>
              {/* Helpful hint */}
              {allFilled && selCount < 6 && (
                <p className="text-[11px] mt-1.5" style={{ color:"rgba(52,211,153,0.6)" }}>
                  Quota reached. Deselect a map to swap.
                </p>
              )}
            </div>

            {/* Start + End Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Start Time</FieldLabel>
                <WithIcon icon={Clock}>
                  <input name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange}
                    style={{ ...baseInput, colorScheme:"dark" }} onFocus={focusIn} onBlur={focusOut} />
                </WithIcon>
              </div>
              <div>
                <FieldLabel>End Time</FieldLabel>
                <WithIcon icon={Clock}>
                  <input name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange}
                    style={{ ...baseInput, colorScheme:"dark" }} onFocus={focusIn} onBlur={focusOut} />
                </WithIcon>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleUpdate} disabled={loading}
              className="w-full py-4 rounded-xl text-[14px] font-bold tracking-[1.5px] uppercase flex items-center justify-center gap-2 mt-1 transition-all duration-300"
              style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7,#7c3aed)", backgroundSize:"200% auto", color:"#f0f4ff", fontFamily:"'Exo 2',sans-serif", border:"1px solid rgba(168,85,247,0.4)", cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1 }}
              onMouseOver={e => { if(!loading){ e.currentTarget.style.boxShadow="0 0 28px rgba(168,85,247,0.55)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
              onMouseOut={e  => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
              {loading
                ? <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>UPDATING...</>
                : <><Save size={15}/> SAVE CHANGES</>
              }
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
        input[type="datetime-local"]::-webkit-calendar-picker-indicator{filter:invert(0.4) sepia(1) saturate(5) hue-rotate(230deg);cursor:pointer;opacity:0.7}
        select option{background:#0a1628;color:#f0f4ff}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
      `}</style>
    </div>
  );
}

export default EditTournament;