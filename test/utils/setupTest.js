const config = require('../../src/config/config');
const fs = require('fs');
const path = require('path');

const jestBootstrap = () => {

    beforeAll(async () => {

        // turn off console messages
        global.console = {
            ...console,
            log: jest.fn(),
            debug: jest.fn(),
        };
    });
};

const emptyUploadFolder = () => {
    const directory = config.uploadPath;
    if (fs.existsSync(config.uploadPath)){
        const files = fs.readdirSync(directory);
        files.forEach(file => fs.unlinkSync(path.join(directory, file)));
    }
}

const removeUploadFolder = () => {
    emptyUploadFolder();
    if (fs.existsSync(config.uploadPath)){
        fs.rmdirSync(config.uploadPath);
        console.log('Upload folder removed.');
    }
}

const createUploadFolder = () => {
    if (!fs.existsSync(config.uploadPath)){
        fs.mkdirSync(config.uploadPath);
        console.log('Upload folder created.');
    }
}

module.exports = {
    jestBootstrap,
    removeUploadFolder,
    createUploadFolder
}