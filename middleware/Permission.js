const { ForbiddenError } = require("../util/customError");

class Permission {
    static isManager = async (req, res, next) => {
        if ((!(req.user.role === 0) && !(req.user.role === 1))) {
            return next(new ForbiddenError());
        }
        next();
    };
}


module.exports = Permission;