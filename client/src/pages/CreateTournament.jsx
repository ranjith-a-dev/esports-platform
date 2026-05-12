import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  IndianRupee,
  Map,
  CalendarClock,
  Zap,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const MAPS = [
  "Bermuda",
  "Kalahari",
  "Purgatory",
  "Alpine",
  "Nexterra",
  "Solara",
];

function CreateTournament() {
  const [formData, setFormData] = useState({
    title: "",
    game: "Free Fire Max",
    prizePool: "",
    entryFee: "",
    numberOfMaps: "",
    selectedMaps: [],
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numberOfMaps") {
      const num = Number(value);

      if (num > 6) {
        toast.error("Maximum 6 maps allowed");
        return;
      }

      setFormData({
        ...formData,
        numberOfMaps: value,
        selectedMaps: formData.selectedMaps.slice(0, num),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMapSelect = (mapName) => {
    const selected = formData.selectedMaps;
    const limit = Number(formData.numberOfMaps);

    if (!limit) {
      toast.success("Enter number of maps first");
      return;
    }

    if (selected.includes(mapName)) {
      setFormData({
        ...formData,
        selectedMaps: selected.filter((m) => m !== mapName),
      });
      return;
    }

    if (selected.length >= limit) {
      toast.success(`Only ${limit} maps allowed`);
      return;
    }

    setFormData({
      ...formData,
      selectedMaps: [...selected, mapName],
    });
  };

  const handleCreateTournament = async () => {
    if (!formData.title.trim()) {
      toast.success("Enter tournament title");
      return;
    }

    if (!formData.prizePool) {
      toast.success("Enter prize pool");
      return;
    }

    if (!formData.entryFee) {
      toast.success("Enter entry fee");
      return;
    }

    if (!formData.numberOfMaps) {
      toast.success("Enter number of maps");
      return;
    }

    if (
      formData.selectedMaps.length !==
      Number(formData.numberOfMaps)
    ) {
      toast.success("Select exact number of maps");
      return;
    }

    if (!formData.startTime) {
      toast.success("Select start time");
      return;
    }

    if (!formData.endTime) {
      toast.success("Select end time");
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/tournaments/create",
        {
          name: formData.title,
          game: "Free Fire Max",
          prizePool: Number(formData.prizePool),
          entryFee: Number(formData.entryFee),
          slots: 12,
          numberOfMaps: Number(formData.numberOfMaps),
          selectedMaps: formData.selectedMaps,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Tournament created successfully");

      setTimeout(() => {
        navigate("/tournaments");
      }, 1200);

    } catch (error) {
      toast.success(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(6,12,20,0.8)",
    border: "1px solid rgba(100,116,139,0.3)",
    borderRadius: "12px",
    padding: "14px 16px 14px 48px",
    color: "#f0f4ff",
    fontFamily: "'Exo 2', sans-serif",
    fontSize: "14px",
    outline: "none",
    letterSpacing: "0.3px",
    transition: "all 0.3s ease",
  };

  const fields = [
    {
      name: "title",
      placeholder: "Tournament Title",
      icon: Trophy,
      type: "text",
    },
    {
      name: "prizePool",
      placeholder: "Prize Pool (₹)",
      icon: IndianRupee,
      type: "number",
    },
    {
      name: "entryFee",
      placeholder: "Entry Fee (₹)",
      icon: IndianRupee,
      type: "number",
    },
    {
      name: "numberOfMaps",
      placeholder: "Number of Maps",
      icon: Map,
      type: "number",
    },
    {
      name: "startTime",
      placeholder: "Start Date & Time",
      icon: CalendarClock,
      type: "datetime-local",
    },
    {
      name: "endTime",
      placeholder: "End Date & Time",
      icon: CalendarClock,
      type: "datetime-local",
    },
  ];

  return (
    <div
      className="min-h-screen px-6 py-10 relative"
      style={{
        background: "#020408",
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(234,179,8,0.08)_0%,transparent_70%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(234,179,8,0.12) 0%,rgba(10,22,40,0.8) 60%,rgba(124,58,237,0.08) 100%)",
            border:
              "1px solid rgba(234,179,8,0.2)",
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(234,179,8,0.15) 0%,transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="flex items-center gap-4">
            <div
              className="p-3.5 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg,rgba(234,179,8,0.25),rgba(234,179,8,0.1))",
                border:
                  "1px solid rgba(234,179,8,0.35)",
                color: "#facc15",
              }}
            >
              <Trophy size={28} />
            </div>

            <div>
              <p
                className="text-[11px] font-semibold tracking-[2px] uppercase mb-1"
                style={{
                  color:
                    "rgba(234,179,8,0.7)",
                }}
              >
                Admin Panel
              </p>

              <h1
                className="text-[24px] font-black tracking-wide bg-clip-text text-transparent"
                style={{
                  fontFamily:
                    "'Orbitron', sans-serif",
                  backgroundImage:
                    "linear-gradient(135deg,#f0f4ff,#facc15)",
                }}
              >
                CREATE TOURNAMENT
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className="rounded-[20px] p-8"
          style={{
            background:
              "rgba(6,12,20,0.85)",
            backdropFilter:
              "blur(24px)",
            border:
              "1px solid rgba(168,85,247,0.15)",
          }}
        >
          <div className="flex flex-col gap-4">
            {fields.map(
              ({
                name,
                placeholder,
                icon: Icon,
                type,
              }) => (
                <div key={name}>
                  <label
                    className="block text-[11px] font-semibold tracking-[1.5px] uppercase mb-2"
                    style={{
                      color:
                        "rgba(168,85,247,0.8)",
                    }}
                  >
                    {placeholder}
                  </label>

                  <div className="relative">
                    <Icon
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          "rgba(148,163,184,0.5)",
                      }}
                    />

                    <input
                      type={type}
                      min={name === "numberOfMaps" ? 1 : undefined}
                      max={name === "numberOfMaps" ? 6 : undefined}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      min={
                        name === "startTime"
                          ? new Date().toISOString().slice(0, 16)
                          : name === "endTime"
                          ? formData.startTime || new Date().toISOString().slice(0, 16)
                          : undefined
                      }
                      style={{
                        ...inputStyle,
                        colorScheme: "dark"
                      }}
                    />
                  </div>
                </div>
              )
            )}

            {/* Maps */}
            <div>
              <label
                className="block text-[11px] font-semibold tracking-[1.5px] uppercase mb-3"
                style={{
                  color:
                    "rgba(168,85,247,0.8)",
                }}
              >
                Select Maps By Order
              </label>

              <div className="grid grid-cols-2 gap-3">
                {MAPS.map((map) => {
                  const active =
                    formData.selectedMaps.includes(
                      map
                    );

                  return (
                    <button
                      key={map}
                      type="button"
                      onClick={() =>
                        handleMapSelect(map)
                      }
                      className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                      style={{
                        background: active
                          ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                          : "rgba(6,12,20,0.8)",
                        border: active
                          ? "1px solid rgba(168,85,247,0.6)"
                          : "1px solid rgba(100,116,139,0.3)",
                        color: active
                          ? "#fff"
                          : "#cbd5e1",
                      }}
                    >
                      {map}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button */}
            <button
              onClick={
                handleCreateTournament
              }
              disabled={loading}
              className="w-full py-4 rounded-xl text-[15px] font-bold tracking-[1.5px] uppercase transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              style={{
                background:
                  "linear-gradient(135deg,#854d0e,#ca8a04,#854d0e)",
                color: "#fef9c3",
                border:
                  "1px solid rgba(234,179,8,0.3)",
                opacity: loading
                  ? 0.6
                  : 1,
              }}
            >
              {loading ? (
                "CREATING..."
              ) : (
                <>
                  <Zap
                    size={16}
                    fill="currentColor"
                  />
                  LAUNCH TOURNAMENT
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default CreateTournament;