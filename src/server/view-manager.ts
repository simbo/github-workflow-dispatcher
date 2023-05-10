import { Server } from '@hapi/hapi';
import nunjucks from 'nunjucks';

import { baseURL, isDevelopment, isProduction } from '../config/config.js';
import { debugLog } from '../utils/debug-log.js';
import { homepage, title, version } from '../utils/package-json.js';
import { rootPath } from '../utils/root-path.js';

export async function addViewManager(server: Server) {
  await server.register({
    name: 'view-manager',
    register(srv: Server) {
      srv.dependency('@hapi/vision');
    }
  });

  const nunjucksEnv = nunjucks.configure([rootPath('views'), rootPath('views', 'layouts')], {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
    watch: isDevelopment,
    noCache: isDevelopment
  });

  server.views({
    engines: {
      njk: {
        compile: (src, options) => {
          debugLog(server, ['views'], `compiling template '${options.filename}'`);
          const template = nunjucks.compile(src, options.environment, options.filename);
          return context => template.render(context);
        },
        prepare: (options: any, next) => {
          options.compileOptions = options.compileOptions || {};
          options.compileOptions.environment = nunjucksEnv;
          return next();
        }
      }
    },
    relativeTo: rootPath(),
    path: 'views',
    isCached: isProduction,
    context: {
      appTitle: title,
      appVersion: version,
      appHomepage: homepage,
      appBaseURL: baseURL
    }
  });
}
