import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts.api";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createPost(title, content, mediaUrl);
      navigate("/");
    } catch (err) {
      console.error("Post creation failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10" style={{ background: "#0f0a06" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        textarea:focus, input:focus { outline: none; }
        textarea::placeholder, input::placeholder { color: rgba(253,251,212,0.25); }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,88,0,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <span className="text-3xl font-black tracking-tight" style={{
            background: "linear-gradient(90deg, #FDFBD4 0%, #C05800 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Ripple
          </span>
          <p className="text-sm mt-1" style={{ color: "rgba(253,251,212,0.4)" }}>Share something with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-sm font-semibold"
              style={{ color: "#FDFBD4" }}
            />
          </div>

          {/* Content */}
          <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)" }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="w-full bg-transparent text-sm resize-none"
              style={{ color: "#FDFBD4" }}
            />
          </div>

          {/* Media URL */}
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(192,88,0,0.7)" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="flex-1 bg-transparent text-sm"
              style={{ color: "#FDFBD4" }}
            />
          </div>

          {/* Preview */}
          {mediaUrl && (
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(192,88,0,0.2)" }}>
              <img src={mediaUrl} alt="Preview" className="w-full object-cover" style={{ maxHeight: 200 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #C05800, #713600)", color: "#FDFBD4" }}
          >
            {loading ? "Posting..." : "Share Post"}
          </button>

          <button type="button" onClick={() => navigate("/")}
            className="text-xs text-center transition-opacity hover:opacity-80"
            style={{ color: "rgba(253,251,212,0.35)" }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
