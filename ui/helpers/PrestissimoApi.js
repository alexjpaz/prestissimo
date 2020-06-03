import * as axios from 'axios';

import { logger } from './logger';

export class PrestissimoApi {
  constructor({ client = PrestissimoApi.standardClient() }) {
    this.client = client;
  }

  async fetchTransactions() {
    try {
      const rsp = await this.client.get('/api/transactions');

      return rsp.data;
    } catch(e) {
      logger.error(e.message);
      throw e;
    }
  }

  async fetchTransaction(transactionId) {
    try {
      const rsp = await this.client.get(`/api/transactions/${transactionId}`);

      return rsp.data;
    } catch(e) {
      logger.error(e.message);
      throw e;
    }
  }

  async status() {
    try {
      const rsp = await this.client.get('/api/status');

      return rsp.data;
    } catch(e) {
      logger.error(e.message);
      throw e;
    }
  }

  async uploadManifest(manifest) {
  };

  async ping() {
    try {
      const rsp = await this.client.get('/ping');

      return rsp.data;
    } catch(e) {
      logger.error(e.message);
      throw e;
    }
  }

  async debugProcessInbox() {
  }

  static standard() {
    return PrestissimoApi.fromEnvironment();
  }

  static fromEnvironment() {
    // TODO
    let baseURL = "./";
    baseURL = "http://localhost:3000/local";

    return new PrestissimoApi({
      client: axios.create({
        baseURL,
      })
    })
  }

  static standardClient() {
    return axios.create();
  }
}
