const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const { Article, Comment, User, CommentLike } = require("../models");

//? All Comments for Article
const allComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { slug } = req.params;

    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comments = await article.getComments({
      include: [
        { model: User, as: "author", attributes: { exclude: ["email"] } },
      ],
    });

    for (const comment of comments) {
      await appendFollowers(loggedUser, comment);
      const liked = loggedUser ? await comment.hasUser(loggedUser) : false;
      comment.dataValues.liked = loggedUser ? liked : false;
      comment.dataValues.likesCount = comment.likeCount;
    }

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

//* Create Comment for Article
const createComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { body } = req.body.comment;
    if (!body) throw new FieldRequiredError("Comment body");

    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = await Comment.create({
      body: body,
      articleId: article.id,
      userId: loggedUser.id,
    });

    delete loggedUser.dataValues.token;
    comment.dataValues.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

//* Delete Comment for Article
const deleteComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    if (loggedUser.id !== comment.userId) {
      throw new ForbiddenError("comment");
    }

    await comment.destroy();

    res.json({ message: { body: ["Comment deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

//* Like/Unlike Comment
const likeUnlikeComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    if (req.method === "POST") {
      try {
        await comment.addUser(loggedUser);
        await comment.increment("likeCount", { by: 1 });
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          // Already liked - no-op (idempotent)
        } else {
          throw error;
        }
      }
    } else if (req.method === "DELETE") {
      const removed = await comment.removeUser(loggedUser);
      if (removed) {
        await comment.decrement("likeCount", { by: 1 });
      }
    }

    const liked = await comment.hasUser(loggedUser);
    res.json({
      comment: {
        ...comment.toJSON(),
        liked,
        likesCount: comment.likeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { allComments, createComment, deleteComment, likeUnlikeComment };
