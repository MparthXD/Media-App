import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 w-full"
      style={{
        background: "rgba(15,10,6,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(253,251,212,0.07)",
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <span
          className="text-2xl font-black tracking-tight"
          style={{
            background: "linear-gradient(90deg, #FDFBD4 0%, #C05800 60%, #713600 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ripple
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {token ? (
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
            style={{ border: "1px solid rgba(192,88,0,0.4)", color: "#C05800" }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-xs font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #C05800, #713600)",
              color: "#FDFBD4",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
