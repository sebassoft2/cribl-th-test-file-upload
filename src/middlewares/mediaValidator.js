const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const config = require('../config/config');

const mediaValidation = (req, res, next) => {
    try {
        fs.accessSync(config.uploadPath, fs.constants.F_OK);
        next();
    } 
    catch (err) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Configuration error. Upload folder does not exists or is not writable.'));
    }
}

module.exports = {
    mediaValidation
};