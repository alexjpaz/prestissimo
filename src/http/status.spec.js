const { expect } = require('chai');
const sinon = require('sinon');

const express = require('express');
const supertest = require('supertest');

const AWS = require('../utils/aws');

const {
  Status,
  performChecks,
} = require('./status');

describe('status', () => {

  describe('Status', () => {
    let s3;
    let request;

    beforeEach(() => {
      request = supertest(Status());
    });

    it('should have an OK status', async () => {

      const rsp = await request.get('/status')
        .expect(200)
      ;

      expect(rsp.body.status).to.eql("OK");
    });
  });

  describe('performChecks', () => {
    it('should show OK status', async () => {
      const results = await performChecks([{
        name: "always_pass",
        check: () => {
        }
      }]);

      expect(results[0].name).to.eql("always_pass");
      expect(results[0].status).to.eql("OK");
    });

    it('should show critical status on error', async () => {
      const results = await performChecks([{
        name: "always_fail",
        check: () => {
          throw new Error("OOF");
        }
      }]);

      expect(results[0].name).to.eql("always_fail");
      expect(results[0].message).to.eql("OOF");
      expect(results[0].status).to.eql("CRITICAL");
    });
  });
});
