import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dateFormatter from "../../helpers/dateFormatter";
import deleteComment from "../../services/deleteComment";
import getComments from "../../services/getComments";
import toggleCommentLike from "../../services/toggleCommentLike";
import CommentAuthor from "./CommentAuthor";

function CommentList({ triggerUpdate, updateComments }) {
  const [comments, setComments] = useState([]);
  const { headers, isAuth, loggedUser } = useAuth();
  const { slug } = useParams();

  useEffect(() => {
    getComments({ slug }).then(setComments).catch(console.error);
  }, [slug, triggerUpdate]);

  const handleDelete = (commentId) => {
    if (!isAuth) alert("You need to login first");

    const confirmation = window.confirm("Want to delete the comment?");
    if (!confirmation) return;

    deleteComment({ commentId, headers, slug })
      .then(updateComments)
      .catch(console.error);
  };

  const handleLike = (commentId) => {
    const action = "like";
    toggleCommentLike({ slug, commentId, action })
      .then((updatedComment) => {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likeCount: updatedComment.likeCount }
              : c
          )
        );
      })
      .catch(console.error);
  };

  return comments?.length > 0 ? (
    comments.map(({
      author,
      author: { username },
      body,
      createdAt,
      id,
      likeCount = 0,
    }) => {
      return (
        <div className="card" key={id}>
          <div className="card-block">
            <p className="card-text">{body}</p>
          </div>
          <div className="card-footer">
            <CommentAuthor {...author} />
            <span className="date-posted">{dateFormatter(createdAt)}</span>
            <button
              className="btn btn-sm btn-primary btn-outline-secondary pull-xs-right"
              onClick={() => handleLike(id)}
            >
              <i className="ion-heart"></i>
              <span> {likeCount}</span>
            </button>
            {isAuth && loggedUser.username === username && (
              <button
                className="btn btn-sm btn-outline-secondary pull-xs-right"
                onClick={() => handleDelete(id)}
              >
                <i className="ion-trash-a"></i>
              </button>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div>There are no comments yet...</div>
  );
}

export default CommentList;