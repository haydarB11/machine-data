require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class Helper {

    /**
     * 
     * @param {string} password 
     * @returns {Promise<string>}
     */
    static hashPassword = async (password) => {
        const saltRounds = parseInt(process.env.NUMBER_OF_ROUNDS, 10) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    };

    /**
     * 
     * @param {User} user 
     * @returns {string}
     */
    static generateToken = async (user) => {
        return await jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY);
    }

    /**
     * 
     * @param {string} password 
     * @param {string} savedPassword 
     * @returns {Promise<boolean>}
     */
    static validPassword = async (password, savedPassword) => {
        return await bcrypt.compare(password, savedPassword);
    }

}

module.exports = Helper;
