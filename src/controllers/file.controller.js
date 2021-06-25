const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../config/config');

// list uploaded files
const listFiles = async (req, res) => {
    const files = await fs.promises.readdir(config.uploadPath);
    res.send(
        await Promise.all(
            files.map(async file => {
                const stats = await (fs.promises.stat(path.join(config.uploadPath, file)));
                return {
                    filename: file, 
                    size: stats.size,
                    created: stats.ctime
                }
            })
        )
    );
}

// upload file in binary format
const uploadBinaryFile = (req, res, next) => {

    if (!req.query.filename) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'filename parameter is mandatory'));
    }

    const filename = req.query.filename;
    const force = (req.query.force === 'true');
    const filePath = path.join(config.uploadPath, filename);

    if (path.extname(filename) != '.tgz') {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Only files with tgz extension are allowed'));
    }

    if (fs.existsSync(filePath) && !force) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'File already exists. Use force parameter to override.'));
    }

    const stream = fs.createWriteStream(filePath);
  
    stream.on('open', () => {
        req.pipe(stream)
        console.log('Upload started ... 0.00%');
    });

    stream.on('drain', () => {
        const uploadedBytes = parseInt(stream.bytesWritten);
        const totalBytes = parseInt(req.headers['content-length']);
        const uploadedPercentage = (uploadedBytes / totalBytes * 100).toFixed(2)
        console.log(`Uploading  ...  ${uploadedPercentage}%`);
    });
       
    stream.on('close', () => {
        console.log('Uploading  ...  100%');
        res.send({code: httpStatus.OK, message: 'File uploaded successfully!'});
    });
       
    stream.on('error', err => {
        return next(err);
    });
}

// upload file in form multi-part format
const uploadFile = (req, res, next) => {

    const force = (req.query.force === 'true');

    const busboy = new Busboy({
        headers: req.headers
    });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

        const filePath = path.join(config.uploadPath, path.basename(filename));

        if (path.extname(filename) != '.tgz') {
            return next(new ApiError(httpStatus.BAD_REQUEST, 'Only files with tgz extension are allowed'));
        }

        if (fs.existsSync(filePath) && !force) {
            return next(new ApiError(httpStatus.BAD_REQUEST, 'File already exists. Use force parameter to override.'));
        }
    
        const stream = fs.createWriteStream(filePath);
        file.pipe(stream);

        console.log('Upload started ... 0.00%');
    });

    busboy.on('finish', function() {
        console.log('Uploading  ...  100%');
        res.send({code: httpStatus.OK, message: 'File uploaded successfully!'});
    });

    return req.pipe(busboy);
}

// download an uploaded file
const downloadFile = (req, res, next) => {

    if (!req.query.filename) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'filename parameter is mandatory'));
    }

    const filename = req.query.filename;
    const filePath = path.join(config.uploadPath, filename);

    if (!fs.existsSync(filePath)) {
        return next(new ApiError(httpStatus.NOT_FOUND, 'File does not exists'));
    }

    const mimetype = mime.lookup(filePath);

    res.setHeader('Content-disposition', 'attachment; filename=' + filePath);
    res.setHeader('Content-type', mimetype);
  
    const filestream = fs.createReadStream(filePath);
    filestream.pipe(res);    
}

module.exports = {
    listFiles,
    uploadFile,
    uploadBinaryFile,
    downloadFile
};