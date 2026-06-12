const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers, appendCommentLikes } = require("../helper/helpers");
const { Article, Comment, User } = require("../models");

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
      await appendCommentLikes(loggedUser, comment);
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
    await appendCommentLikes(loggedUser, comment);

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

//* Like Comment (幂等)
const likeComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    // 幂等：检查是否已点赞
    const alreadyLiked = await comment.hasUser(loggedUser);
    if (!alreadyLiked) {
      await comment.addUser(loggedUser);
      const newCount = await comment.countUsers();
      await comment.update({ likeCount: newCount });
    }

    await appendCommentLikes(loggedUser, comment);
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};

//* Unlike Comment (幂等)
const unlikeComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    // 幂等：检查是否已取消点赞
    const isLiked = await comment.hasUser(loggedUser);
    if (isLiked) {
      await comment.removeUser(loggedUser);
      const newCount = await comment.countUsers();
      await comment.update({ likeCount: newCount });
    }

    await appendCommentLikes(loggedUser, comment);
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};

module.exports = { allComments, createComment, deleteComment, likeComment, unlikeComment };
