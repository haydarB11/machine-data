'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMachine extends Model {
    static associate(models) {

      this.hasMany(models.User, {
        foreignKey: 'group_id',
        as: 'users',
        onDelete: "CASCADE",
      });

      this.belongsToMany(models.Machine, {
        foreignKey: 'group_id',
        as: 'machines',
        onDelete: "CASCADE",
        through: models.GroupMachine,
      });

    }
  }
  GroupMachine.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'GroupMachine',
    underscored: true,
  });

  return GroupMachine;
};