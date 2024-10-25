const { MachineData, Sequelize, Group, GroupMachine, User } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const MachineService = require("./MachineService");

class MachineDataService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<MachineData>|null}
     */
    async findModel(id) {
        const machineData = await MachineData.findByPk(id);
        return machineData;
    }

    /**
     * @param {Object} body 
     * @param {number} user_id 
     * @returns {Promise<Object>}
     */
    async create(body, user_id) {
        const notFoundMachine = [];
        const errors = [];
        const machineData = [];
        let machine;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        for (const item in body.data) {
            try {
                machine = await MachineService.findMachineByWellNo(body.data[item].well_no);
            } catch (error) {
                notFoundMachine.push(body.data[item]);
                continue;
            }
            const isCreateToday = await this.#_getDataForToday(machine.id, startOfDay, endOfDay);
            try {
                if (isCreateToday) {
                    await this.#_deleteMachineData(machine.id, startOfDay, endOfDay);
                }
                machineData.push(await this.#_createMachineData(body.data[item], machine.id, user_id));
            } catch (error) {
                errors.push(body.data[item]);
                continue;
            }
        }

        return {
            create: machineData,
            not_found: notFoundMachine,
            error: errors
        };
    };

    /**
     * @param {number} group_id 
     * @param {string} date 
     * @returns {Promise<MachineData[]>}
     */
    async findAll(group_id, date) {
        const today = new Date(date);
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const group = await Group.findByPk(group_id);
        if (!group) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" }));
        }
        const machinesIds = await GroupMachine.findAll({
            attributes: ["machine_id", "order"],
            where: {
                group_id: group_id
            },
            order: [
                [Sequelize.literal('CASE WHEN `order` IS NULL THEN 1 ELSE 0 END'), 'ASC'],
                ['order', 'ASC'],
            ],
        });

        const ids = machinesIds.map(machine => machine.machine_id);
        let where = {};
        where.machine_id = ids;
        if (date) {
            where.created_at = {
                [Sequelize.Op.between]: [startOfDay, endOfDay]
            }
        }
        let machinesData = [];
        if (ids.length > 0) {
            machinesData = await MachineData.findAll({
                where,
                include: [
                    "machine",
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "user_name", "email"]
                    }
                ]
            });
            if (machinesData.length <= 0) {
                return [];
            }
            machinesData = ids.map(id => {
                let machineDataByMachineId = machinesData.filter(machine => machine.machine_id === id);
                machineDataByMachineId = machineDataByMachineId.sort((a, b) => b.createdAt / 1000 - a.createdAt / 1000);
                return machineDataByMachineId
            });
        }
        const admin = await User.findOne({
            where: {
                group_id: group_id,
                is_admin_group: true
            }
        })
        return {
            items: machinesData.flat(),
            admin: admin
        }
    };

    /**
 * @param {number} user_id 
 * @param {string} date 
 * @returns {Promise<MachineData[]>}
 */
    async findAllForAdminGroup(user_id, date) {
        const today = new Date(date);
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const user = await User.findOne({
            where: {
                id: user_id,
                is_admin_group: true
            }
        });
        if (!user || user.group_id == null) {
            throw new NotFoundError("User not admin of this group.");
        }
        const machinesIds = await GroupMachine.findAll({
            attributes: ["machine_id", "order"],
            where: {
                group_id: user.group_id
            },
            order: [
                [Sequelize.literal('CASE WHEN `order` IS NULL THEN 1 ELSE 0 END'), 'ASC'],
                ['order', 'ASC'],
            ],
        });

        const ids = machinesIds.map(machine => machine.machine_id);
        let where = {};
        where.machine_id = ids;
        if (date) {
            where.created_at = {
                [Sequelize.Op.between]: [startOfDay, endOfDay]
            }
        }
        let machinesData = [];
        if (ids.length > 0) {
            machinesData = await MachineData.findAll({
                where,
                include: [
                    "machine",
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "user_name", "email"]
                    }
                ]
            });
            if (machinesData.length <= 0) {
                return [];
            }
            machinesData = ids.map(id => {
                let machineDataByMachineId = machinesData.filter(machine => machine.machine_id === id);
                machineDataByMachineId = machineDataByMachineId.sort((a, b) => b.createdAt / 1000 - a.createdAt / 1000);
                return machineDataByMachineId
            });
        }
        return machinesData.flat();
    }
    /**
     * 
     * @param {number} machine_id 
     * @param {Date} startOfDay 
     * @param {Date} endOfDay 
     * @returns {Promise<boolean>}
     */
    async #_getDataForToday(machine_id, startOfDay, endOfDay) {
        const machineData = await MachineData.findOne({
            where: {
                machine_id: machine_id,
                created_at: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                }
            }
        });
        if (!machineData) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {number} machine_id 
     * @param {Date} startOfDay 
     * @param {Date} endOfDay
     */
    async #_deleteMachineData(machine_id, startOfDay, endOfDay) {
        const machineData = await MachineData.findOne({
            where: {
                machine_id: machine_id,
                created_at: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                }
            }
        });
        await machineData.destroy();
    }

    /**
     * 
     * @param {Object} item 
     * @param {number} machine_id 
     * @param {number} user_id 
     * @returns {Promise<MachineData>}
     */
    async #_createMachineData(item, machine_id, user_id) {
        const machineData = await MachineData.create({
            ...item,
            machine_id: machine_id,
            user_id: user_id
        }
        );
        return machineData;
    }
}
module.exports = new MachineDataService();