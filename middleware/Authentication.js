const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { UnauthorizedError, ForbiddenError } = require("../util/customError");
require('dotenv').config();

class Authentication {
    static isAuth = async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) {
            return next(new UnauthorizedError());
        }
        const replaceToken = token.replace("Bearer ", "");
        let decoded;
        try {
            decoded = jwt.verify(replaceToken, process.env.SECRET_KEY);
        } catch (error) {
            return next(new UnauthorizedError());
        }
        if (!decoded) {
            return next(new UnauthorizedError());
        }
        const user = await User.findByPk(decoded.id)
        if (!user || user.status === User.STATUS_INACTIVE) {
            return next(new ForbiddenError());
        }
        req.user = decoded;
        next();
    };
}

module.exports = Authentication;