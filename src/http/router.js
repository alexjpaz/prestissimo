const config = require('config');
const express = require('express');
const multer  = require('multer');

const os = require('os');

const AWS = require('../utils/aws');
const { logger } = require('../utils/logger');

const fs = require('fs').promises;

const defaultProps = () => ({
  s3: new AWS.S3()
});

const Router = (props = defaultProps()) => {
  const { s3 } = props;

  const app = express();

  const upload = multer({ dest: os.tmpdir() })

  app.post('/upload', upload.array('file', 10), async (req, res, next) => {
    try {

      const promises = req.files
        .map(async (file) => {
          try {
            await s3.putObject({
              Bucket: config.awsBucket,
              Key: `uploads/raw/${file.filename}/${file.originalname}`,
              Body: await fs.readFile(file.path)
            }).promise();
          } finally {
            await fs.unlink(file.path);
          }
        });

      await Promise.all(promises);

      return res.sendStatus(201);
    } catch(e) {
      logger.error(e);
      return next(e);
    }
  });

  return app;
};

module.exports = Router;
