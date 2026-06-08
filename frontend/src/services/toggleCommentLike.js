import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function toggleCommentLike({ slug, commentId, liked, headers }) {
  try {
    const method = liked ? "DELETE" : "POST";
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