const swaggerJsdoc = require('swagger-jsdoc');
const express = require("express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: '게시판 CRUD API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: [
    './controller/*.js',
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;