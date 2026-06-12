import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toggleCommentLike from "../../services/toggleCommentLike";

function LikeButton({ liked, likesCount, handler, commentId, slug }) {
  const [loading, setLoading] = useState(false);
  const { headers, isAuth } = useAuth();

  const handleClick = () => {
    if (!isAuth) return alert("You need to login first");

    setLoading(true);

    toggleCommentLike({ slug, commentId, liked, headers })
      .then(handler)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <button
      className={`btn btn-sm btn-outline-secondary ${liked ? "active" : ""}`}
      disabled={loading}
      onClick={handleClick}
    >
      <i className="ion-heart"></i> {likesCount}
    </button>
  );
}

export default LikeButton;