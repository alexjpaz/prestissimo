const express = require('express');

const config = require('config');

const AWS = require('../utils/AWS');

const CHECK_TIMEOUT = 4500;
const FILTER_INCLUDE_ALL = i => i;

const performChecks = async (checks, filter = FILTER_INCLUDE_ALL) => {
  const results = [];

  const promises = checks
    .filter(filter)
    .map((check) => {
      check.status = "UNKNOWN";

      return new Promise(async (res) => {
        const timeoutId = setTimeout(() => {
          results.push({
            ...check,
            status: "TIMEOUT",
          });

          res();
        }, CHECK_TIMEOUT);

        let result;

        try {
          result = await check.check();
          results.push({
            ...check,
            status: "OK",
            result
          });
        } catch(e) {
          results.push({
            ...check,
            status: "CRITICAL",
            message: e.message,
          });
        }

        clearTimeout(timeoutId);
        res();
      });
    });

  await Promise.all(promises);

  return results;
};

const Status = (s3 = new AWS.S3()) => {
  const app = express();

  const checks = [{
    name: "s3",
    check: async () => {
      const s3 = new AWS.S3();

      //const rsp = await s3.headBucket({
        //Bucket: config.awsBucket
      //}).promise();
    }
  },];

  app.get('/status', async function (req, res) {
    let filter = FILTER_INCLUDE_ALL;

    if(req.query.name) {
      filter = (i) => {
        return i.name === req.query.name
      };
    }

    const results = await performChecks(checks, filter);

    let status = results.reduce((p, c) => {
      if(c.status !== 'OK') {
        return "CRITICAL";
      }
      return p;
    }, "OK");

    res.send({
      status,
      timestamp: new Date(),
      checks,
    });
  })

  return app;
};

module.exports = {
  Status,
  performChecks
};
