const express = require('express');

const User = () => {
  const app = express();

  app.use((req, res, next) => {
    return next();
  });

  app.use((req, res, next) => {
    req.user = {
      userId: "FAKE_LOCAL",
    };

    next();
  });

  return app;
};

module.exports = {
  User
};
