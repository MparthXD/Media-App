import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ background: "#0f0a06" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        input:focus { outline: none; }
        input::placeholder { color: rgba(253,251,212,0.25); }
      `}</style>

      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,88,0,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <span className="text-4xl font-black tracking-tight" style={{
            background: "linear-gradient(90deg, #FDFBD4 0%, #C05800 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Ripple
          </span>
          <p className="text-sm mt-2" style={{ color: "rgba(253,251,212,0.4)" }}>Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-2xl px-4 py-4" style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)" }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full bg-transparent text-sm"
              style={{ color: "#FDFBD4" }}
            />
          </div>

          <div className="rounded-2xl px-4 py-4" style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-sm"
              style={{ color: "#FDFBD4" }}
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#C05800" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 mt-2"
            style={{ background: "linear-gradient(135deg, #C05800, #713600)", color: "#FDFBD4" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(253,251,212,0.35)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#C05800", fontWeight: 700, textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
