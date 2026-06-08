import { Link } from "react-router-dom";
import dateFormatter, { timeAgo } from "../../helpers/dateFormatter";
import Avatar from "../Avatar";

function ArticleMeta({ author, children, createdAt, updatedAt }) {
  const { bio, followersCount, following, image, username } = author || {};
  const showLastEdited = updatedAt && updatedAt !== createdAt;
  const lastEditedText = showLastEdited ? `Last edited ${timeAgo(updatedAt)}` : null;

  return (
    <div className="article-meta">
      <Link
        state={{ bio, followersCount, following, image }}
        to={`/profile/${username}`}
      >
        <Avatar alt={username} src={image} />
      </Link>
      <div className="info">
        <Link
          className="author"
          state={{ bio, followersCount, following, image }}
          to={`/profile/${username}`}
        >
          {username}
        </Link>
        <span className="date">{dateFormatter(createdAt)}</span>
        {lastEditedText && (
          <span className="date"> · {lastEditedText}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default ArticleMeta;