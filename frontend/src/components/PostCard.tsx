import { useNavigate } from "react-router-dom";

const PostCard = ({ post, onLike }) => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#0f0a06" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #C05800, #713600)", color: "#FDFBD4" }}
        >
          {post.title?.[0]?.toUpperCase() || "?"}
        </div>
        <p className="font-bold text-sm" style={{ color: "#FDFBD4" }}>{post.title}</p>
      </div>

      {/* Media */}
      {post.media_url && (
        <div
          className="relative overflow-hidden cursor-pointer"
          onClick={() => navigate(`/posts/${post.id}`)}
        >
          <img
            src={post.media_url}
            alt="Post media"
            className="w-full object-cover"
            style={{ maxHeight: 480, minHeight: 200 }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{ background: "linear-gradient(to top, rgba(15,10,6,0.5), transparent)" }}
          />
        </div>
      )}

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(253,251,212,0.8)" }}>
          {post.content}
        </p>

        {/* Actions — like + comment */}
        <div className="flex items-center gap-5">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 transition-transform active:scale-75"
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              fill={post.is_liked_by_me ? "#C05800" : "none"}
              stroke={post.is_liked_by_me ? "#C05800" : "rgba(253,251,212,0.6)"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span
              className="text-sm font-semibold"
              style={{ color: post.is_liked_by_me ? "#C05800" : "rgba(253,251,212,0.6)" }}
            >
              {post.likes_count}
            </span>
          </button>

          {/* Comment — navigates to PostDetail */}
          <button
            onClick={() => navigate(`/posts/${post.id}`)}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-100 opacity-60"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,212,0.6)" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "rgba(253,251,212,0.6)" }}>
              {post.comments_count ?? "Comment"}
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(253,251,212,0.06)", margin: "0 16px" }} />
    </div>
  );
};

export default PostCard;
