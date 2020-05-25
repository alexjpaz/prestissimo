const request = require('superagent');

const { JWT, JWKS } = require('jose');

const util = require('util');

const fs = require('fs').promises;

const config = require('config');

const { logger } = require('../utils/logger');

const Authorizer = (props = config.authorizer) => {

  const getPolicyDocument = (effect, resource) => {
    const policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [{
        Action: 'execute-api:Invoke', // default action
        Effect: effect,
        Resource: resource,
      }]
    };
    return policyDocument;
  }


  // extract and return the Bearer Token from the Lambda event parameters
  const getToken = (params) => {
    if (!params.type || params.type !== 'TOKEN') {
      throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    const tokenString = params.authorizationToken;
    if (!tokenString) {
      throw new Error('Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
  }

  const jwtOptions = {
    audience: props.audience,
    issuer: props.issuer,
  };

  let cachedKeyStore;
  let cacheTimeout = 60 * 1000; // 60 seconds
  let expiresAt;

  const getKeyStore = async (jwksUri = props.jwksUri) => {
    const now = new Date();

    if(cachedKeyStore) {
      if(now < expiresAt) {
        return cachedKeyStore;
      }
    }

    let jwks;

    if(jwksUri.startsWith('http://') || jwksUri.startsWith('https://')) {
      try {
        let rsp = await request.get(jwksUri);

        jwks = rsp.body;
      } catch(e) {
        logger.error("Failed to get signing key", e);
        throw e;
      }
    }

    if(jwksUri.startsWith('file://')) {
      try {
        let path = jwksUri.replace('file://','');
        const buffer = await fs.readFile(path);

        jwks = JSON.parse(buffer.toString());
      } catch(e) {
        logger.error("Failed to get signing key", e);
        throw e;
      }
    }

    if(!jwks) {
      throw new Error("Unknown handler for " + jwksUri);
    }

    cachedKeyStore = JWKS.asKeyStore(jwks);
    expiresAt = new Date(now.getTime() + cacheTimeout);

    return cachedKeyStore;
  };

  const verifyAndDecodeToken = async (access_token) => {
    let keyStore = await getKeyStore();

    try {
      await JWT.verify(access_token, keyStore);
    } catch(e) {
      logger.error(e);
      throw e;
    }

    let decoded = JWT.decode(access_token);

    return decoded;
  };

  const authenticate = async (params) => {
    const token = getToken(params);

    const decoded = await verifyAndDecodeToken(token);

    return {
      principalId: decoded.sub,
      policyDocument: getPolicyDocument('Allow', params.methodArn),
      context: { scope: decoded.scope }
    };
  }

  return authenticate;
};

module.exports = Authorizer;
