'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MachineData extends Model {
    static associate(models) {

      this.belongsTo(models.Machine, {
        foreignKey: 'machine_id',
        as: 'machine',
      });

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

    }
  }
  MachineData.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asmp_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asmp_p: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asmp_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volt_ab: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volt_bc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volt_ac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tank_capacity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panel_owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    left_chock_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    left_chock_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    left_chock_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    right_chock_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    right_chock_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    right_chock_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ti: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vx: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cip: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'MachineData',
    underscored: true,
  });

  return MachineData;
};