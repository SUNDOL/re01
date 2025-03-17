const getMessage = require("../constants/messages");

const resHandler = (req, res, next) => {
    res.response = (code, data = null) => {
        return res.status(code || 9999).json({
            code: code || 9999,
            msg: getMessage(code) || "Unknown Error",
            ...(data && { data })
        });
    };
    next();
};

module.exports = resHandler;