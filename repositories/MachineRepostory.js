const { Machine, Sequelize } = require("../models");

class MachineRepository {

    /**
     * Finds a machine by its primary key.
     * 
     * @param {number} id 
     * @returns {Promise<Machine>|null}
     */
    async findById(id) {
        return await Machine.findByPk(id);
    }

    /**
     * Creates a new machine.
     * 
     * @param {Object} data 
     * @returns {Promise<Machine>}
     */
    async create(data) {
        return await Machine.create(data);
    }

    /**
     * Updates a machine with the given data.
     * 
     * @param {Object} data 
     * @param {number} id 
     * @returns {Promise<Machine>}
     */
    async update(data, id) {
        const machine = await Machine.findByPk(id);
        if (machine) {
            await machine.update(data);
        }
        return machine;
    }

    /**
     * Finds a machine by its primary key with optional related notes.
     * 
     * @param {number} id 
     * @param {boolean} includeNotes 
     * @returns {Promise<Machine>}
     */
    async findByIdWithNotes(id, includeNotes = false) {
        return await Machine.findByPk(id, {
            include: includeNotes ? ["notes"] : [],
        });
    }

    /**
     * Finds all machines with optional related notes.
     * 
     * @param {boolean} includeNotes 
     * @returns {Promise<Machine[]>}
     */
    async findAll(includeNotes = false) {
        return await Machine.findAll({
            include: includeNotes ? ["notes"] : [],
            order: [
                [Sequelize.literal('CASE WHEN `order` IS NULL THEN 1 ELSE 0 END'), 'ASC'],
                ['order', 'ASC'],
            ],
        });
    }

    /**
     * Deletes a machine by its primary key.
     * 
     * @param {number} id 
     * @returns {Promise<Machine>}
     */
    async deleteById(id) {
        const machine = await Machine.findByPk(id);
        if (machine) {
            await machine.destroy();
        }
        return machine;
    }

    /**
     * Updates the order of machines.
     * 
     * @param {Array} machines 
     * @returns {Promise<Array>}
     */
    async updateOrder(machines) {
        const updatePromises = machines.map((machine, index) =>
            Machine.update(
                { order: index + 1 },
                { where: { id: machine.id } }
            )
        );
        return await Promise.all(updatePromises);
    }
}

module.exports = new MachineRepository();
