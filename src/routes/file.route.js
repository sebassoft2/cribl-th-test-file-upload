const express = require('express');
const fileController = require('../controllers/file.controller');

const router = express.Router();

router
  .route('/list')
  .get(fileController.listFiles);

router
  .route('/upload')
  .post(fileController.uploadFile);

router
  .route('/uploadBinary')
  .post(fileController.uploadBinaryFile);

router
  .route('/download')
  .get(fileController.downloadFile);

module.exports = router;