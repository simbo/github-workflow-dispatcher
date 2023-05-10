import { Server } from '@hapi/hapi';
import nunjucks from 'nunjucks';

import { debugLog } from '../utils/debug-log.js';
import { rootPath } from '../utils/root-path.js';

import { FileLoader } from './file-loader.js';
import { minifyHTML } from './html-minifier.js';
import { VIEW_MANAGER, VIEWS_PATH } from './view-manager.constants.js';

const nunjucksOptions = {
  autoescape: true,
  lstripBlocks: true,
  noCache: true, // hapi view manager takes care of caching
  throwOnUndefined: true,
  trimBlocks: true
};

const nunjucksEnv = new nunjucks.Environment(
  new FileLoader(rootPath(VIEWS_PATH, 'layouts'), nunjucksOptions),
  nunjucksOptions
);

export function templateEngine(server: Server) {
  return {
    compile(
      src: string,
      { filename }: { filename: string },
      done: (
        error?: Error,
        render?: (
          context: { [key: string]: string },
          options: never,
          callback: (error?: Error, html?: string) => void
        ) => void
      ) => void
    ) {
      debugLog(server, [VIEW_MANAGER], `compiling template '${filename}'`);
      Promise.resolve()
        .then(() => {
          const template = nunjucks.compile(src, nunjucksEnv, filename);
          return minifyHTML(template.tmplStr).then(tmplStr => {
            template.tmplStr = tmplStr;
            return template;
          });
        })
        .then(template => done(undefined, (context, options, callback) => template.render(context, callback)))
        .catch(done);
    }
  };
}
