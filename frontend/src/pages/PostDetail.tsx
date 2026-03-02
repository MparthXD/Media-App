import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost } from "../api/posts.api";
import { getComments, addComment, deleteComment } from "../api/comments.api";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState("");

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => getPost(postId!),
    enabled: !!postId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId!),
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentInput("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleAddComment = () => {
    if (!commentInput.trim() || !postId) return;
    addCommentMutation.mutate({ postId, content: commentInput });
  };

  const Spinner = ({ size = 36 }: { size?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `${size > 30 ? 3 : 2}px solid rgba(192,88,0,0.2)`,
      borderTop: `${size > 30 ? 3 : 2}px solid #C05800`,
      animation: "spin 0.8s linear infinite",
      flexShrink: 0,
    }} />
  );

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "#0f0a06" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Spinner />
      <span className="text-sm" style={{ color: "rgba(253,251,212,0.4)" }}>Loading post...</span>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a06" }}>
      <p className="text-sm" style={{ color: "rgba(253,251,212,0.4)" }}>Failed to load post.</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#0f0a06" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        input:focus { outline: none; }
        input::placeholder { color: rgba(253,251,212,0.25); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(15,10,6,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(253,251,212,0.07)" }}>
        <button onClick={() => navigate(-1)} className="opacity-70 hover:opacity-100 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FDFBD4" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="font-bold text-sm" style={{ color: "#FDFBD4" }}>Post</span>
      </header>

      <div className="max-w-sm mx-auto">
        {/* Post */}
        <div className="px-4 py-5" style={{ borderBottom: "1px solid rgba(253,251,212,0.06)" }}>
          <h2 className="font-black text-lg mb-3" style={{ color: "#FDFBD4" }}>{post.title}</h2>
          {post.media_url && (
            <img src={post.media_url} alt="media" className="w-full rounded-2xl object-cover mb-4"
              style={{ maxHeight: 360, border: "1px solid rgba(192,88,0,0.15)" }} />
          )}
          <p className="text-sm leading-relaxed" style={{ color: "rgba(253,251,212,0.8)" }}>{post.content}</p>
          <p className="text-xs mt-3" style={{ color: "rgba(253,251,212,0.3)" }}>
            {comments?.length ?? 0} comment{comments?.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Add comment */}
        <div className="px-4 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(253,251,212,0.06)" }}>
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            placeholder="Write a comment..."
            className="flex-1 rounded-2xl px-4 py-3 text-sm"
            style={{ background: "rgba(56,36,13,0.35)", border: "1px solid rgba(192,88,0,0.2)", color: "#FDFBD4" }}
          />
          <button
            onClick={handleAddComment}
            disabled={addCommentMutation.isPending || !commentInput.trim()}
            className="px-4 py-3 rounded-2xl text-sm font-bold transition-opacity hover:opacity-80 disabled:opacity-40 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C05800, #713600)", color: "#FDFBD4" }}
          >
            {addCommentMutation.isPending ? "..." : "Post"}
          </button>
        </div>

        {/* Comments list */}
        <div className="px-4 py-2 pb-10">
          {commentsLoading ? (
            <div className="flex justify-center py-10"><Spinner size={28} /></div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: "rgba(253,251,212,0.3)" }}>No comments yet. Be the first!</p>
            </div>
          ) : (
            comments?.map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-3 py-4"
                style={{ borderBottom: "1px solid rgba(253,251,212,0.04)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #C05800, #713600)", color: "#FDFBD4" }}>
                  {comment.content?.[0]?.toUpperCase() || "?"}
                </div>
                <p className="flex-1 text-sm leading-relaxed pt-1" style={{ color: "rgba(253,251,212,0.85)" }}>
                  {comment.content}
                </p>
                <button
                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                  disabled={deleteCommentMutation.isPending}
                  className="opacity-25 hover:opacity-60 transition-opacity flex-shrink-0 mt-1 disabled:opacity-10"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FDFBD4" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;