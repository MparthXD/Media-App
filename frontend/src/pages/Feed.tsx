import { useEffect, useState } from "react";
import { getPosts, toggleLike } from "../api/posts.api.ts";
import PostCard from "../components/PostCard";





const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  const limit = 10;

  const loadMore = async () => {
    const newOffset = offset + limit;
    const newPosts = await getPosts(limit, newOffset);
    if (newPosts.length === 0) {
      setHasMore(false);
      return;
    }
    setPosts((prev) => [...prev, ...newPosts]);
    setOffset(newOffset);
  };

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes_count: post.is_liked_by_me
                ? post.likes_count - 1
                : post.likes_count + 1,
              is_liked_by_me: !post.is_liked_by_me,
            }
          : post
      )
    );
    try {
      await toggleLike(postId);
    } catch (err) {
      console.error("like failed", err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(limit, 0);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);



  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#0f0a06" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: rgba(253,251,212,0.3); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Ambient glows */}
      <div style={{
        position: "fixed", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,88,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: 120, right: -80, width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(113,54,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div className="w-full max-w-sm flex flex-col min-h-screen relative" style={{ background: "#0f0a06" }}>

        {/* NAVBAR */}
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
          style={{ background: "rgba(15,10,6,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(253,251,212,0.07)" }}
        >
          <span className="text-2xl font-black tracking-tight" style={{
            background: "linear-gradient(90deg, #FDFBD4 0%, #C05800 60%, #713600 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Ripple
          </span>

        </header>



        {/* FEED CONTENT */}
        <div className="flex-1 pb-24">

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "3px solid rgba(192,88,0,0.2)",
                borderTop: "3px solid #C05800",
                animation: "spin 0.8s linear infinite",
              }} />
              <span className="text-sm" style={{ color: "rgba(253,251,212,0.4)" }}>Loading your feed...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span style={{ fontSize: 48 }}>☕</span>
              <p className="font-bold text-sm" style={{ color: "#FDFBD4" }}>No posts yet</p>
              <p className="text-xs" style={{ color: "rgba(253,251,212,0.4)" }}>Be the first to share something</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post.id} style={{ borderBottom: "1px solid rgba(253,251,212,0.06)" }}>
                  <PostCard post={post} onLike={handleLike} />
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-80 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #C05800, #713600)",
                      color: "#FDFBD4",
                    }}
                  >
                    Load more
                  </button>
                </div>
              )}

              {!hasMore && (
                <div className="flex flex-col items-center py-8 gap-2">
                  <div className="w-12 h-px" style={{ background: "rgba(253,251,212,0.15)" }} />
                  <p className="text-xs" style={{ color: "rgba(253,251,212,0.3)" }}>You're all caught up ✨</p>
                  <div className="w-12 h-px" style={{ background: "rgba(253,251,212,0.15)" }} />
                </div>
              )}
            </>
          )}
        </div>


        {/* BOTTOM NAV — Home | Create | Profile */}
        <nav
          className="fixed bottom-0 z-50 w-full max-w-sm flex items-center justify-around px-6 py-3"
          style={{ background: "rgba(15,10,6,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(253,251,212,0.07)" }}
        >
          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center justify-center w-12 h-12 transition-transform active:scale-90"
          >
            <svg width="26" height="26" viewBox="0 0 24 24"
              fill={activeTab === "home" ? "#C05800" : "none"}
              stroke={activeTab === "home" ? "#C05800" : "#FDFBD4"} strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>

          {/* Create Post — big gradient pill */}
          <a
            href="/create-post"
            className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-transform active:scale-90 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C05800, #713600)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDFBD4" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </a>

          {/* Profile */}
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center justify-center w-12 h-12 transition-transform active:scale-90"
          >
            <svg width="26" height="26" viewBox="0 0 24 24"
              fill="none"
              stroke={activeTab === "profile" ? "#C05800" : "#FDFBD4"} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Feed;
