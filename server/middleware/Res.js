const getMessage = require("../constants/messages");

const resHandler = (req, res, next) => {
    res.response = (code, info = null) => {
        return res.status(code).json({
            code: code,
            msg: getMessage(code),
            ...(info && { info })
        });
    };
    next();
};

module.exports = resHandler;