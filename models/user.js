'use strict';

const { Model } = require('sequelize');
const Helper = require('../util/helper');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {

        static ROLE_MANAGER = 1;
        static ROLE_USER = 2;

        static STATUS_ACTIVE = 1;
        static STATUS_INACTIVE = 2;

        static ROLE_MANAGER_CODE = "manager";
        static ROLE_USER_CODE = "user";

        static STATUS_ACTIVE_CODE = "active";
        static STATUS_INACTIVE_CODE = "inactive";

        static getRoleCodes() {
            return {
                [User.ROLE_MANAGER]: User.ROLE_MANAGER_CODE,
                [User.ROLE_USER]: User.ROLE_USER_CODE
            };
        };

        static getStatusCodes() {
            return {
                [User.STATUS_ACTIVE]: User.STATUS_ACTIVE_CODE,
                [User.STATUS_INACTIVE]: User.STATUS_INACTIVE_CODE
            };
        };

        static getStatusIntFromCode() {
            return {
                [User.STATUS_ACTIVE_CODE]: User.STATUS_ACTIVE,
                [User.STATUS_INACTIVE_CODE]: User.STATUS_INACTIVE
            };
        };

        static getRoleIntFromCode() {
            return {
                [User.ROLE_MANAGER_CODE]: User.ROLE_MANAGER,
                [User.ROLE_USER_CODE]: User.ROLE_USER
            };
        };

        async generateToken() {
            return await Helper.generateToken(this);
        };

        async validPassword(password) {
            return await Helper.validPassword(password, this.password);
        }

        static associate(models) {
            this.hasMany(models.Note, {
                foreignKey: 'user_id',
                as: 'notes',
                onDelete: "CASCADE",
            });

            this.belongsTo(models.Group, {
                foreignKey: 'group_id',
                as: 'group',
            });

            this.hasMany(models.MachineData, {
                foreignKey: 'user_id',
                as: 'machine_data',
            });

        };

    }
    User.init({
        user_name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: {
                    args: true,
                    msg: i18next.t("validation.empty_message", { field: "Name" }),
                }
            },
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: i18next.t("validation.empty_message", { field: "Name" }),
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: i18next.t("validation.empty_message", { field: "Password" }),
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            email: true,
            unique: true,
            validate: {
                notEmpty: {
                    args: true,
                    msg: i18next.t("validation.empty_message", { field: "Email" }),
                },
            },
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: User.ROLE_USER,
            validate: {
                isIn: {
                    args: [Object.values(User.getRoleIntFromCode())],
                    msg: "Invalid role",
                },
            },
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: User.STATUS_INACTIVE,
            validate: {
                isIn: {
                    args: [Object.values(User.getStatusIntFromCode())],
                    msg: "Invalid status",
                },
            },
        },
        is_admin_group: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
        {
            sequelize,
            modelName: 'User',
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['password', 'role'] }
            },
            hooks: {
                beforeCreate: async (user, options) => {
                    if (user.password) {
                        user.password = await Helper.hashPassword(user.password);
                    }
                }
            }
        });

    return User;
};