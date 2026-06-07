import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function toggleCommentLike({ slug, commentId, action }) {
  try {
    const { data } = await axios({
      method: "POST",
      url: `api/articles/${slug}/comments/${commentId}/like`,
      data: { action },
    });

    return data.comment;
  } catch (error) {
    errorHandler(error);
  }
}

export default toggleCommentLike;