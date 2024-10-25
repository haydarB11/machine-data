'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {

      this.belongsTo(models.Machine, {
        foreignKey: 'machine_id',
        as: 'machine',
        onDelete: "CASCADE",
      });

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: "CASCADE",
      });

    }
  }
  Note.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "text cannot be empty",
        },
        len: {
          args: [5, 2000],
          msg: "text must be between 10 and 2000 characters long",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Note',
    underscored: true
  });

  return Note;
};