const config = require('config');
const { JWKS, JWT } = require('jose');
const fs = require('fs').promises;

const superagent = require('superagent');
const supertest = require('supertest');

let baseUrl = process.env.BASE_URL || "http://localhost:3000/local";

let request = supertest(baseUrl);

const aSecond = (t = 1000) => new Promise(r => setTimeout(r, t));

const getAccessToken = async () => {
  if(config && config.authorizer && config.authorizer.jwksUri.startsWith("file://")) {
    try {
      let path = config.authorizer.jwksUri.replace('file://','');
      const buffer = await fs.readFile(path);
      jwks = JSON.parse(buffer.toString());
      keyStore = JWKS.asKeyStore(jwks);
      let key = keyStore.all()[0];

      let token = JWT.sign(
        { scope: 'test' },
        key,
        {
          subject: "foo",
          audience: config.authorizer.audience,
          issuer: config.authorizer.issuer,
        }
      );

      return token;
    } catch(e) {
      throw e;
    }
    return
  }
  //
  try {
    const rsp = await superagent.post('https://alexjpaz.auth0.com/oauth/token')
      .send({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        audience: "https://prestissimo.alexjpaz.com",
        grant_type: "client_credentials"
      });

    return rsp.body.access_token;
  } catch(e) {
    console.error("Failed to get access token", e.message);
    throw e;
  }
};


module.exports = {
  baseUrl,
  getAccessToken,
  request,
  aSecond,
};
