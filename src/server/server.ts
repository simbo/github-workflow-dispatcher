import Hapi, { Server, ServerOptions } from '@hapi/hapi';
import { plugin as inert } from '@hapi/inert';
import vision from '@hapi/vision';

import { githubOauthPlugin } from '../auth/github-oauth.plugin.js';
import { hostname as host, isProduction, port } from '../config/config.js';
import { dispatcherPlugin } from '../dispatcher/dispatcher.plugin.js';
import { addViewManager } from '../view-manager/view-manager.js';

import { errorHandlingPlugin } from './error-handling.plugin.js';
import { routes } from './routes.js';

export async function startServer(): Promise<Server> {
  const serverOptions: ServerOptions = {
    port,
    host,
    debug: {
      log: isProduction ? ['implementation', 'info'] : ['*'],
      request: isProduction ? ['implementation'] : ['*']
    }
  };

  const server = Hapi.server(serverOptions);

  await server.register([vision, inert, errorHandlingPlugin, githubOauthPlugin, dispatcherPlugin]);

  await addViewManager(server);

  server.route(routes);

  await server.start();

  return server;
}
