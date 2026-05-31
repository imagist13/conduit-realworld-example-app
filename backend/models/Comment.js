"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Article, CommentLike }) {
      this.belongsTo(Article, { foreignKey: "articleId" });
      this.belongsTo(User, { as: "author", foreignKey: "userId" });
      this.belongsToMany(User, {
        through: CommentLike,
        foreignKey: "commentId",
        timestamps: false,
      });
    }

    toJSON() {
      return {
        ...this.get(),
        articleId: undefined,
        userId: undefined,
      };
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      body: DataTypes.TEXT,
      articleId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
