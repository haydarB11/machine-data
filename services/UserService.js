const i18next = require("../util/i18n/config");
const { User } = require("../models");
const { NotFoundError, UnauthorizedError } = require("../util/customError");
const { Op } = require("sequelize");

class UserService {

        /**
     * 
     * @param {number} id 
     * @returns {Promise<User>|null}
     */
        async findModel(id) {
            const user = await User.findByPk(id);
            return user;
        }

    /**
     * @param {Object} body 
     * @returns {User}
     */
    async create(body) {
        let user = await User.create(body);
        user = user.toJSON();
        delete user.password;
        delete user.role;
        delete user.status;
        return user;
    }

    /**
     * 
     * @param {string} emailOrUsername 
     * @param {string} password
     * @returns {Object}
     */
    async login(emailOrUsername, password) {
        let user = await User.scope(null).findOne({
            where: {
                [Op.or]: [
                    {
                        email: emailOrUsername
                    },
                    {
                        user_name: emailOrUsername
                    }
                ],
            },
            include: "group"
        });
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: emailOrUsername }));
        }
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
            throw new UnauthorizedError(i18next.t("validation.wrong_password_message", { field: password }));
        }
        if (user.status !== User.STATUS_ACTIVE) {
            throw new UnauthorizedError(i18next.t("validation.inactive_user_message"));
        }

        const token = await user.generateToken()
        user = user.toJSON();
        delete user.password;
        delete user.role;
        delete user.status;

        const responseData = {
            user,
            token
        }
        return responseData;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Object}
     */
    async toggleStatus(id) {
        let user = await User.scope(null).findByPk(id);
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "User" }));
        }
        if (user.status === User.STATUS_ACTIVE) {
            user.status = User.STATUS_INACTIVE
        } else {
            user.status = User.STATUS_ACTIVE
        }
        await user.save();

        user = user.toJSON();
        delete user.password;
        delete user.role;
        user.status = User.getStatusCodes()[user.status];

        return user;
    };

    /**
     * 
     * @returns {Promise<User[]>}
     */
    async findUsers() {
        const users = await User.findAll({
            include: "group"
        });
        const modifiedUsers = users.map(user => {
            user.setDataValue('status', User.getStatusCodes()[user.status]);
            return user;
        });
        return modifiedUsers;
    }

}

module.exports = new UserService();