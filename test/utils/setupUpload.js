const config = require('../../src/config/config');
const fs = require('fs');
const path = require('path');

const setupUpload = () => {

    const emptyUploadDir = () => {
        // empty upload directory to setup unit test
        const directory = config.uploadPath;
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }

    beforeAll(async () => {

        // turn off console messages
        global.console = {
            ...console,
            log: jest.fn(),
            debug: jest.fn(),
        };

        emptyUploadDir();
    });

    afterAll(async () => {

        emptyUploadDir();
    });
};

module.exports = setupUpload;