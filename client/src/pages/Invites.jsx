import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  XCircle,
  Users,
  Inbox,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function Invites() {
  const [invites, setInvites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadInvites = async () => {
      try {
        const res = await API.get("/teams/invites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvites(res.data);
      } catch (error) {
        toast.success(error.response?.data?.message || "Error");
      }
    };

    loadInvites();
  }, [token]);

  const refreshInvites = async () => {
    try {
      const res = await API.get("/teams/invites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvites(res.data);
    } catch (error) {
      toast.success(error.response?.data?.message || "Error");
    }
  };

  const handleAccept = async (teamId) => {
    try {
      await API.post(
        "/teams/accept-invite",
        { teamId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Joined team successfully");
      refreshInvites();
    } catch (error) {
      toast.success(error.response?.data?.message || "Error");
    }
  };

  const handleReject = async (teamId) => {
    try {
      await API.post(
        "/teams/reject-invite",
        { teamId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Invite rejected");
      refreshInvites();
    } catch (error) {
      toast.success(error.response?.data?.message || "Error");
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-10 relative"
      style={{
        background: "#020408",
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(168,85,247,0.12)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(10,22,40,0.8) 60%,rgba(168,85,247,0.08) 100%)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <span
            className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-2xl"
            style={{
              borderColor: "rgba(168,85,247,0.5)",
            }}
          />

          <span
            className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-2xl"
            style={{
              borderColor: "rgba(168,85,247,0.5)",
            }}
          />

          <div className="flex items-center gap-4">
            <div
              className="p-3.5 rounded-xl shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.15))",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#a855f7",
              }}
            >
              <Mail size={28} strokeWidth={1.5} />
            </div>

            <div>
              <p
                className="text-[11px] font-semibold tracking-[2px] uppercase mb-1"
                style={{
                  color: "rgba(168,85,247,0.7)",
                }}
              >
                Inbox
              </p>

              <h1
                className="text-[24px] font-black tracking-wide bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  backgroundImage:
                    "linear-gradient(135deg,#f0f4ff,#a855f7)",
                }}
              >
                PENDING INVITES
              </h1>

              <p
                className="text-[13px] mt-1"
                style={{
                  color: "rgba(148,163,184,0.6)",
                }}
              >
                {invites.length} invitation
                {invites.length !== 1 ? "s" : ""} awaiting
                your response
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {invites.length === 0 ? (
          <div
            className="rounded-2xl p-14 text-center"
            style={{
              background: "rgba(6,12,20,0.8)",
              border:
                "1px solid rgba(168,85,247,0.12)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background:
                  "rgba(168,85,247,0.08)",
                border:
                  "1px solid rgba(168,85,247,0.2)",
                color: "rgba(168,85,247,0.5)",
              }}
            >
              <Inbox size={32} strokeWidth={1.5} />
            </div>

            <h2
              className="text-[18px] font-bold mb-2"
              style={{
                color: "#f0f4ff",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              ALL CLEAR
            </h2>

            <p
              className="text-[14px]"
              style={{
                color: "rgba(148,163,184,0.5)",
              }}
            >
              No pending invites — you're all caught up 🎮
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {invites.map((invite, i) => (
              <div
                key={invite._id}
                className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(6,12,20,0.85)",
                  backdropFilter: "blur(12px)",
                  border:
                    "1px solid rgba(168,85,247,0.15)",
                  animation:
                    "fadeSlideUp 0.4s ease forwards",
                  animationDelay: `${i * 0.08}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg,#7c3aed,#a855f7,transparent)",
                  }}
                />

                <div className="flex items-center justify-between gap-4 pl-3">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))",
                        border:
                          "1px solid rgba(168,85,247,0.3)",
                        color: "#a855f7",
                      }}
                    >
                      <Users size={20} strokeWidth={1.5} />
                    </div>

                    <div>
                      <h2
                        className="text-[16px] font-bold tracking-wide"
                        style={{ color: "#f0f4ff" }}
                      >
                        {invite.team.teamName}
                      </h2>

                      <p
                        className="text-[13px] mt-0.5"
                        style={{
                          color:
                            "rgba(148,163,184,0.6)",
                        }}
                      >
                        Invited by{" "}
                        <span
                          className="font-semibold"
                          style={{
                            color: "#a855f7",
                          }}
                        >
                          {invite.invitedBy.inGameName}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() =>
                        handleAccept(invite.team._id)
                      }
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-200"
                      style={{
                        background:
                          "rgba(34,197,94,0.1)",
                        border:
                          "1px solid rgba(34,197,94,0.3)",
                        color: "#4ade80",
                      }}
                    >
                      <CheckCircle size={15} />
                      ACCEPT
                    </button>

                    <button
                      onClick={() =>
                        handleReject(invite.team._id)
                      }
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-200"
                      style={{
                        background:
                          "rgba(239,68,68,0.1)",
                        border:
                          "1px solid rgba(239,68,68,0.3)",
                        color: "#f87171",
                      }}
                    >
                      <XCircle size={15} />
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Invites;