'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {

      this.hasMany(models.User, {
        foreignKey: 'group_id',
        as: 'users',
      });

      this.belongsToMany(models.Machine, {
        foreignKey: 'group_id',
        as: 'machines',
        onDelete: "CASCADE",
        through: models.GroupMachine,
      });

    }
  }
  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "well no cannot be empty",
        },
        len: {
          args: [1, 50],
          msg: "Group must be between 1 and 50 characters long",
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Group',
    underscored: true,
  });

  return Group;
};