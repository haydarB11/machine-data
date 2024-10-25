const { Note, User } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");

class NoteService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Note>|null}
     */
    async findModel(id) {
        const note = await Note.findByPk(id);
        return note;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Note>}
     */
    async create(body) {
        const note = await Note.create(body);
        return note;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Note>}
     */
    async update(body, id) {
        const note = await Note.findByPk(id);
        if (!note) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Note" }));
        }
        note.text = body.text || note.text;
        await note.save();
        return note;
    };

    /**
     * 
     * @param {number} id 
     * @param {boolean} includeUser 
     * @returns {Promise<Note>}
     */
    async get(id, includeUser = false) {
        const note = await Note.findByPk(id, {
            include: includeUser ? ["user"] : [],
        });

        if (!note) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Note" }));
        }

        return note;
    }

    /**
     * @param {boolean} includeUser 
     * @param {number} machine_id 
     * @returns {Promise<Note[]>}
     */
    async list(machine_id = null, includeUser = false) {
        let notes;
        notes = await Note.findAll({
            where: machine_id ? { machine_id: machine_id } : {},
            include: includeUser ? ["user"] : [],
            order: [
                ['id', 'DESC'],
            ],
        });
        if (includeUser) {
            notes = notes.map(note => {
                note.user.setDataValue('status', User.getStatusCodes()[note.user.status]);
                return note
            });
        }
        return notes;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Note>}
     */
    async delete(id) {
        const note = await Note.findByPk(id);
        if (!note) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Note" }));
        }
        await note.destroy();
        return note;
    };
}

module.exports = new NoteService();