"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "likeCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Comments", "articleId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Articles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("Comments", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.createTable("CommentLikes", {
      commentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Comments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
    await queryInterface.addIndex("CommentLikes", ["commentId", "userId"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Comments", "likeCount");
    await queryInterface.removeColumn("Comments", "articleId");
    await queryInterface.removeColumn("Comments", "userId");
    await queryInterface.dropTable("CommentLikes");
  },
};