import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trophy, Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (error) {
      toast.success(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.18)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(168,85,247,0.10)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-size-[60px_60px]" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="fixed w-0.5 h-0.5 rounded-full bg-purple-500/60"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + i * 10}%`,
            animation: `floatUp ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Login Card */}
      <div className="relative w-full max-w-110 bg-[rgba(6,12,20,0.85)] backdrop-blur-2xl border border-purple-500/20 rounded-[20px] p-10 shadow-[0_0_30px_rgba(168,85,247,0.25),0_0_80px_rgba(124,58,237,0.1)] animate-fadeSlideUp">

        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/60 rounded-tl-xl" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/60 rounded-tr-xl" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500/60 rounded-bl-xl" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/60 rounded-br-xl" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative bg-linear-to-br from-purple-600/30 to-purple-500/15 border border-purple-500/40 rounded-2xl p-4 mb-4 text-purple-400">
            <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-purple-500/30 to-transparent blur-lg -z-10" />
            <Trophy size={32} strokeWidth={1.5} />
          </div>

          <h1
            className="text-[22px] font-black tracking-[2px] uppercase bg-linear-to-r from-[#f0f4ff] to-purple-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            ESPORTS ARENA
          </h1>

          <p className="text-slate-400/70 text-[13px] mt-1.5 tracking-wide">
            Sign in to continue your journey
          </p>

          <div className="w-15 h-0.5 bg-linear-to-r from-transparent via-purple-600 to-transparent mt-3" />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-3.5">

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-400/80 tracking-[1.5px] uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/50 group-focus-within:text-purple-400/80 transition-colors duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="player@gmail.com"
                onChange={handleChange}
                className="w-full bg-[rgba(6,12,20,0.8)] border border-slate-600/30 rounded-xl py-3.5 pl-12 pr-4 text-[#f0f4ff] text-sm placeholder-slate-500/50 outline-none transition-all duration-300 focus:border-purple-500/70 focus:bg-[rgba(10,22,40,0.9)] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)]"
                style={{ fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.3px" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-400/80 tracking-[1.5px] uppercase mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/50 group-focus-within:text-purple-400/80 transition-colors duration-300"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                onChange={handleChange}
                className="w-full bg-[rgba(6,12,20,0.8)] border border-slate-600/30 rounded-xl py-3.5 pl-12 pr-12 text-[#f0f4ff] text-sm placeholder-slate-500/50 outline-none transition-all duration-300 focus:border-purple-500/70 focus:bg-[rgba(10,22,40,0.9)] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)]"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400/50 hover:text-purple-400/80 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right -mt-1">
            <a
              href="#"
              className="text-[12px] text-purple-500/70 hover:text-purple-400 transition-colors duration-200 tracking-wide">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="relative w-full py-4 rounded-xl border-none cursor-pointer text-[#f0f4ff] text-[15px] font-bold tracking-[1.5px] uppercase overflow-hidden transition-all duration-300 bg-linear-to-r from-purple-700 via-purple-500 to-purple-700 bg-size-[200%_auto] hover:bg-right-center hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(124,58,237,0.3)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-1"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Zap size={16} fill="currentColor" />
                  ENTER THE ARENA
                </>
              )}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 text-slate-600/50 text-[11px] tracking-[2px]">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600/20 to-transparent" />
          OR CONTINUE WITH
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600/20 to-transparent" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {["DISCORD", "GOOGLE"].map((s) => (
            <button
              key={s}
              className="py-2.5 rounded-xl border border-slate-600/20 bg-[rgba(15,30,53,0.5)] text-slate-400/70 text-[12px] font-semibold tracking-widest cursor-pointer transition-all duration-200 hover:border-purple-500/40 hover:text-purple-400"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Register Link */}
        <p className="text-center text-slate-500/70 text-[13px] mt-7">
          New player?{" "}
          <Link
            to="/register"
            className="font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent hover:from-purple-300 hover:to-purple-500 transition-all"
          >
            Create account →
          </Link>
        </p>
      </div>

      {/* Global Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default Login;