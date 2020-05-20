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

  app.use(express.static('public'))

  app.get('/api/status', (req, res) => {
    res.send({
      status: "OK",
    });
  });

  app.put('/upload/signed-url', async (req, res, next) => {
    try {
      const url = await s3.getSignedUrlPromise('putObject', {
        Bucket: config.awsBucket,
        Key: 'foobar', // FIXME
        Expires: 300,
      });

      if(!url) {
        throw Error("InvalidStateException: no url created");
      }

      return res.send(url);
    } catch(e) {
      logger.log(e);
      return next(e);
    }
  });

  app.post('/upload/signed-url', async (req, res, next) => {
    s3.createPresignedPost({
      Bucket: config.awsBucket,
      Expires: 300,
      Conditions: [
        ['starts-with', '$key', 'uploads/raw/'],
        ['content-length-range', 0, 52428800]
      ]
    }, function (err, data) {
      if(err) {
        return next(err);
      }

      res.send(data);
    });
  });

  return app;
};

module.exports = Router;
