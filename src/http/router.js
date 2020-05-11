const express = require('express');

const Router = () => {
  const app = express();

  app.post('/upload', (req, res) => {
    res.send(201);
  });

  return app;
};

module.exports = Router;
