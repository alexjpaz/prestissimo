import { PrestissimoApi } from './PrestissimoApi';

import * as axios from 'axios';

describe('PrestissimoApi', () => {
  let client;
  let api;

  beforeEach(() => {
    client = {
    };

    api = new PrestissimoApi({ client });
  });

  test('status', async () => {
    client.get = jest.fn(async () => {
      return {
        data: {
          status: "OK",
        }
      };
    });

    const { status } = await api.status();
    expect(status).toEqual("OK");
  });
});
