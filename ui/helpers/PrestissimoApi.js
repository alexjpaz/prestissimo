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

  static standardClient() {
    return axios.create();
  }
}
