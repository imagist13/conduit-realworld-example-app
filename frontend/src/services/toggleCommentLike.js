import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function toggleCommentLike({ slug, commentId, isLiked, headers }) {
  try {
    const method = isLiked ? "delete" : "post";
    const { data } = await axios({
      url: `api/articles/${slug}/comments/${commentId}/like`,
      method,
      headers,
    });
    return data.comment;
  } catch (error) {
    errorHandler(error);
  }
}

export default toggleCommentLike;