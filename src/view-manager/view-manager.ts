import { Server } from '@hapi/hapi';

import { baseURL, isProduction } from '../config/config.js';
import { homepage, title, version } from '../utils/package-json.js';
import { rootPath } from '../utils/root-path.js';

import { templateEngine } from './template-engine.js';
import { VIEW_MANAGER, VIEWS_PATH } from './view-manager.constants.js';

export async function addViewManager(server: Server) {
  await server.register({
    name: VIEW_MANAGER,
    register(srv: Server) {
      srv.dependency('@hapi/vision');
    }
  });

  server.views({
    engines: {
      njk: templateEngine(server)
    },
    compileMode: 'async',
    relativeTo: rootPath(),
    path: VIEWS_PATH,
    isCached: isProduction,
    context: {
      appTitle: title,
      appVersion: version,
      appHomepage: homepage,
      appBaseURL: baseURL
    }
  });
}
