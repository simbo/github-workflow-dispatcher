import { Plugin, Server } from '@hapi/hapi';

import { DISPATCHER } from './dispatcher.constants.js';
import { dispatcherRoute } from './dispatcher.route.js';

export const dispatcherPlugin: Plugin<never> = {
  name: DISPATCHER,

  async register(server: Server) {
    server.route(dispatcherRoute);
  }
};
