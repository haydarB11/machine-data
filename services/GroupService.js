const { Group, User, Machine, Sequelize, GroupMachine } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const UserService = require("./UserService");

class GroupService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Group>|null}
     */
    async findModel(id) {
        const group = await Group.findByPk(id);
        return group;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Group>}
     */
    async create(body) {
        const group = await Group.create(body);
        return group;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Group>}
     */
    async update(body, id) {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        group.name = body.name || group.name;
        await group.save();
        return group;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Group>}
     */
    async findGroup(id) {
        let group;
        group = await Group.findByPk(id, {
            include: ["users"]
        });
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        group.setDataValue("users", group.users.map(user => {
            user.setDataValue('status', User.getStatusCodes()[user.status]);
            return user;
        }));

        const machinesIds = await GroupMachine.findAll({
            attributes: ["machine_id", "order"],
            where: {
                group_id: group.id
            },
            order: [
                [Sequelize.literal('CASE WHEN `order` IS NULL THEN 1 ELSE 0 END'), 'ASC'],
                ['order', 'ASC'],
            ],
        });
        const ids = machinesIds.map(machine => machine.machine_id);
        let machines = [];
        if (ids.length > 0) {
            machines = await Machine.findAll({
                where: {
                    id: ids,
                },
                order: [
                    [Sequelize.literal(`FIELD(id, ${ids.join(", ")})`), 'ASC'],
                ]
            });
        }
        group.setDataValue("machines", machines);
        return group;
    }

    /**
     * @returns {Promise<Group[]>}
     */
    async findGroups() {
        const groups = await Group.findAll({
            order: [
                ['id', 'DESC'],
            ],
        });
        return groups;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Group>}
     */
    async deleteGroup(id) {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        await group.destroy();
        return group;
    };


    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Array>}
     */
    async order(body, id) {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        const updatePromises = body.machines.map((machine, index) => this.#_OrderMachine(machine, index, id));
        const results = await Promise.all(updatePromises);
        return results;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Array>}
     */
    async subscribe(body, id) {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        if (Array.isArray(body.users)) {
            const usersPromises = body.users.map(user => this.#_updateUserGroup(user, group));
            await Promise.all(usersPromises);
        }
        if (Array.isArray(body.machines)) {
            const machinesPromises = body.machines.map(machine => this.#addMachineToGroup(machine, group));
            await Promise.all(machinesPromises);
        }
        return;
    };

        /**
     * 
     * @param {number} user_id 
     * @param {number} id 
     * @returns {Promise<Array>}
     */
        async addAdmin(user_id, id) {
            const group = await Group.findByPk(id);
            if (!group) {
                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
            }
            const user = await User.findOne({
                where: {
                    group_id: id,
                    id: user_id
                }
            });
            if (!user) {
                throw new NotFoundError("User not in this group");
            }
            await User.update({
                is_admin_group: false
            }, {
                where: {
                    group_id: id
                }
            })
            user.is_admin_group = true;
            await user.save();
            return;
        };

    /**
     * 
     * @param {number} user_id 
     * @returns {Promise<User>}
     */
    async removeFromGroup(user_id) {
        let user = await UserService.findModel(user_id);
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "User" }));
        }
        user.group_id = null;
        await user.save();
        return user;
    }


    /**
     * 
     * @param {Object} machine 
     * @param {number} index 
     * @param {number} groupId 
     * @returns 
     */
    #_OrderMachine(machine, index, groupId) {
        return GroupMachine.update(
            { order: index + 1 },
            { where: { machine_id: machine.id, group_id: groupId } }
        );
    }

    /**
     * 
     * @param {Object} user
     * @param {Object} group
     * @returns 
     */
    #_updateUserGroup(user, group) {
        return User.update(
            { group_id: group.id },
            { where: { id: user } }
        );
    }

    /**
     * 
     * @param {Object} machine
     * @param {Object} group 
     * @returns 
     */
    #addMachineToGroup(machine, group) {
        return GroupMachine.findOrCreate({
            where: {
                group_id: group.id,
                machine_id: machine
            },
            defaults: {
                group_id: group.id,
                machine_id: machine
            }
        });
    }

}

module.exports = new GroupService();