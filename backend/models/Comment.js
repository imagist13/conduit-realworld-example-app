"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ User, Article }) {
      this.belongsTo(Article, { foreignKey: "articleId" });
      this.belongsTo(User, { as: "author", foreignKey: "userId" });
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
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
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