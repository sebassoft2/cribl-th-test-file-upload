const request = require('supertest');
const app = require('../../src/app');
const httpStatus = require('http-status');
const setupUpload = require('../utils/setupUpload');

setupUpload();

describe('File routes', () => {
    
    describe('POST /file/upload', () => {
        test('upload a wrong file type will throw error', async () => {

            const res = await request(app)
                .post('/file/upload')
                .attach('file', './test/assets/testFile.txt')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'Only files with tgz extension are allowed'
            })                
        })

        test('upload a correct file will give success message', async () => {

            const res = await request(app)
                .post('/file/upload')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.OK)
            
            expect(res.body).toEqual({
                code: httpStatus.OK,
                message: 'File uploaded successfully!'
            })                
        })

        test('upload duplicated file will give error message', async () => {

            const res = await request(app)
                .post('/file/upload')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'File already exists. Use force parameter to override.'
            })                
        })

        test('upload duplicated file with force parameter will give success message', async () => {

            const res = await request(app)
                .post('/file/upload?force=true')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.OK)
            
            expect(res.body).toEqual({
                code: httpStatus.OK,
                message: 'File uploaded successfully!'
            })                
        })
    })

    describe('POST /file/uploadBinary', () => {
        test('filename parameter is mandatory', async () => {

            const res = await request(app)
                .post('/file/uploadBinary')
                .attach('file', './test/assets/testFile.txt')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'filename parameter is mandatory'
            })                
        })

        test('upload a wrong file type will throw error', async () => {

            const res = await request(app)
                .post('/file/uploadBinary?filename=testFile.txt')
                .attach('file', './test/assets/testFile.txt')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'Only files with tgz extension are allowed'
            })                
        })
        test('upload a correct file will give success message', async () => {

            const res = await request(app)
                .post('/file/uploadBinary?filename=testFileB.tgz')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.OK)
            
            expect(res.body).toEqual({
                code: httpStatus.OK,
                message: 'File uploaded successfully!'
            })                
        })

        test('upload duplicated file will give error message', async () => {

            const res = await request(app)
                .post('/file/uploadBinary?filename=testFileB.tgz')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'File already exists. Use force parameter to override.'
            })                
        })

        test('upload duplicated file with force parameter will give success message', async () => {

            const res = await request(app)
                .post('/file/uploadBinary?filename=testFileB.tgz&force=true')
                .attach('file', './test/assets/testFile.tgz')
                .expect(httpStatus.OK)
            
            expect(res.body).toEqual({
                code: httpStatus.OK,
                message: 'File uploaded successfully!'
            })                
        })        
    })

    describe('POST /file/list', () => {
  
        test('should return array of 2 test files in configured upload folder', async () => {

            const res = await request(app)
                .get('/file/list')
                .expect(httpStatus.OK);

            expect(res.body.length).toEqual(2);
            expect(res.body[0].filename).toEqual('testFile.tgz');
            expect(res.body[1].filename).toEqual('testFileB.tgz');
    
        })
    })

    describe('POST /file/download', () => {
  
        test('filename parameter is mandatory', async () => {

            const res = await request(app)
                .get('/file/download')
                .expect(httpStatus.BAD_REQUEST)
            
            expect(res.body).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: 'filename parameter is mandatory'
            })                
        })

        test('incorrect filename should return file does not exist', async () => {

            const res = await request(app)
                .get('/file/download?filename=wrong.txt')
                .expect(httpStatus.NOT_FOUND)
            
            expect(res.body).toEqual({
                code: httpStatus.NOT_FOUND,
                message: 'File does not exists'
            })                
        })

        test('correct file download should return test file content', async () => {

            const res = await request(app)
                .get('/file/download?filename=testFile.tgz')
                .expect(httpStatus.OK)
        })
    })
})  