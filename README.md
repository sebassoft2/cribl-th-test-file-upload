# Cribl Take Home Test - File Upload Service

You are part of an organization that ships software that runs on customers environment, which may or may not have access to the internet. In order to troubleshoot any problems with the product the support team routinely asks customers to collect a diagnostic bundle - a .tgz archive with the relevant configs and logs, and send it over email. However, recently customers have been having problems sharing the bundle with support, either due to it’s size or due to email filter restrictions. You have been tasked with creating a service which customers will use to upload their bundles.

## Solution

This is a NodeJS application developed using Express to create a REST API. It has a file router, hosting 4 services: upload, uploadBinary, list and download. In order to allow big files to be uploaded simultaneously I've used NodeJS Streams in pipeline, reading from the request object and writing in chunks into the disk asynchronously. I've implemented 2 upload methods: 

- upload: Allows you to upload files using form multi-part format. In order to parse HTML request, I've used a library called BusBoy. 

- uploadBinary: Since one of the requirements was to minimize external depedencies, I've implemented this second method, that takes a file in binary format from the request, using only NodeJS native code for demonstration purposes. 

* both upload services receive an optional parameter 'force' that will overwrite existing files with the same name.

## Installation

To install project dependencies, simply run:

```bash
npm install
```

## Libraries used

- **busboy**: [BusBoy](https://github.com/mscdex/busboy) Module for parsing incoming HTML form data. I've used it only to provide an upload option using multi-part form data.
- **express**: [ExpressJS](https://expressjs.com/) Web framework for NodeJS. I've used it to build the REST API.
- **express-oauth-server**: [Express OAuth Server](https://github.com/oauthjs/express-oauth-server) Module for implementing OAuth2 with Express in NodeJS.
- **http-status**: [HTTPStatus](https://www.npmjs.com/package/http-status) Utility to interact with HTTP status codes. I've used it only to avoid hardcode HTTP Status codes.
- **supertest**: [SuperTest](https://github.com/visionmedia/supertest) HTTP Assertions module. I've used it for unit testing purposes.
- **jest**: [Jest](https://jestjs.io/) Javascript Testing Framework. I've used it for unit testing purposes.

## Commands

Running locally:

```bash
npm start
```

Testing:

```bash
# run all tests
npm run test

# run test coverage
npm run coverage
```

## Testing

In order to test file uploads, upload folder is wiped-out before the test suite starts running.

## Project Structure

```
src\
 |--config\         # Configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--utils\          # Utility classes and functions
 |--app.js          # Express app
 |--index.js        # App entry point
```

### API Endpoints

List of available routes:

**File routes**:\
`GET /file/list` - list uploaded files\
`POST /file/upload` - upload files in HTTP Form multi-part format\
`POST /file/uploadBinary` - upload files in binary format\
`POST /file/download` - download file by filename