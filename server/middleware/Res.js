const getMessage = require("../constants/messages");

const resHandler = (req, res, next) => {
    res.response = (code, data = null) => {
        return res.status(code).json({
            code: code,
            msg: getMessage(code),
            ...(data && { data })
        });
    };
    next();
};

module.exports = resHandler;