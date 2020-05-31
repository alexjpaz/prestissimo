import * as axios from 'axios';

import { logger } from './logger';

export class PrestissimoApi {
  constructor({ client = PrestissimoApi.standardClient() }) {
    this.client = client;
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

  async ping() {
    try {
      const rsp = await this.client.get('/ping');

      return rsp.data;
    } catch(e) {
      logger.error(e.message);
      throw e;
    }
  }

  static standard() {
    return new PrestissimoApi({
      client: axios.create({
        baseURL: "./" // TODO
      })
    })
  }

  static standardClient() {
    return axios.create();
  }
}
