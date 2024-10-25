'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Machine extends Model {
    static associate(models) {

      this.hasMany(models.Note, {
        foreignKey: 'machine_id',
        as: 'notes',
        onDelete: "CASCADE",
      });

      this.belongsToMany(models.Group, {
        foreignKey: 'machine_id',
        as: 'groups',
        through: models.GroupMachine,
        onDelete: "CASCADE",
      });

      this.hasMany(models.MachineData, {
        foreignKey: 'machine_id',
        as: 'machine_data',
      });

    }
  }
  Machine.init({
    well_no: {
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
          msg: "well no must be between 1 and 50 characters long",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Machine',
    underscored: true,
  });

  return Machine;
};