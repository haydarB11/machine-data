const { Machine, Sequelize, GroupMachine, Group } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const UserService = require("./UserService");

class MachineService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Machine>|null}
     */
    async findModel(id) {
        const machine = await Machine.findByPk(id);
        return machine;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Machine>}
     */
    async create(body) {
        const machine = await Machine.create(body);
        const groupMachine = await GroupMachine.create({
            machine_id: machine.id,
            group_id: body.group_id
        });
        return machine;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Machine>}
     */
    async update(body, id) {
        const machine = await Machine.findByPk(id);
        if (!machine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Machine" }));
        }
        machine.well_no = body.well_no || machine.well_no;
        await machine.save();
        return machine;
    };

    /**
     * 
     * @param {number} id 
     * @param {boolean} includeNotes 
     * @returns {Promise<Machine>}
     */
    async findMachine(id, includeNotes = false) {
        const machine = await Machine.findByPk(id, {
            include: includeNotes ? ["notes"] : [],
        });

        if (!machine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Machine" }));
        }

        return machine;
    }

    /**
     * 
     * @param {string} well_no 
     * @returns {Promise<Machine>}
     */
    async findMachineByWellNo(well_no) {

        const machine = await Machine.findOne({
            where: {
                well_no: well_no
            }
        });

        if (!machine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Machine" }));
        }

        return machine;
    }

    /**
     * @param {boolean} includeNotes 
     * @param {number} user_id 
     * @returns {Promise<Machine[]>}
     */
    async findMachines(user_id, includeNotes = false) {
        const user = await UserService.findModel(user_id);
        if (!user.group_id) {
            throw new NotFoundError("User not join to group yet");
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
        let machines = [];
        if (ids.length > 0) {
            machines = await Machine.findAll({
                where: {
                    id: ids,
                },
                include: includeNotes ? ["notes"] : [],
            });
            machines = ids.map(id => {
                return machines.find(machine => machine.id === id);
            });
        }
        return machines;
    };

    /**
     * @param {boolean} includeNotes 
     * @param {number} group_id 
     * @returns {Promise<Machine[]>}
     */
    async findMachinesForManager(group_id, includeNotes = false) {
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
        let machines = [];
        if (ids.length > 0) {
            machines = await Machine.findAll({
                where: {
                    id: ids,
                },
                include: includeNotes ? ["notes"] : [],
            });
            machines = ids.map(id => {
                return machines.find(machine => machine.id === id);
            });
        }

        return machines;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Machine>}
     */
    async deleteMachine(id) {
        const machine = await Machine.findByPk(id);
        if (!machine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Machine" }));
        }
        await machine.destroy();
        return machine;
    };


    /**
     * 
     * @param {Object} body 
     * @returns {Promise<Array>}
     */
    async order(body) {
        const updatePromises = body.machines.map(this.#_OrderMachine);
        const results = await Promise.all(updatePromises);
        return results;
    };


    /**
     * 
     * @param {Object} machine 
     * @param {number} index 
     * @returns 
     */
    #_OrderMachine(machine, index) {
        return Machine.update(
            { order: index + 1 },
            { where: { id: machine.id } }
        );
    };

}

module.exports = new MachineService();