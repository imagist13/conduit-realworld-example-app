"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    static associate({ Comment, User }) {
      this.belongsTo(Comment, { foreignKey: "commentId" });
      this.belongsTo(User, { foreignKey: "userId" });
    }
  }
  CommentLike.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Comments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "CommentLike",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["commentId", "userId"],
        },
      ],
    },
  );
  return CommentLike;
};