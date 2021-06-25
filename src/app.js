const express = require('express');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const fileRouter = require('./routes/file.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/file', fileRouter);

// send 404 error for any unknown request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
  
// convert error to ApiError
app.use(errorConverter);
  
// handle errors
app.use(errorHandler);
  
module.exports = app;