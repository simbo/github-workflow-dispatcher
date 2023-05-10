import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { GITHUB_OAUTH } from '../auth/github-oauth.constants.js';
import { isGHE } from '../config/config.js';
import { rootPath } from '../utils/root-path.js';

export const routes: ServerRoute[] = [
  // welcome page
  {
    method: 'GET',
    path: '/',
    options: {
      auth: isGHE ? GITHUB_OAUTH : false
    },
    handler(request: Request, h: ResponseToolkit) {
      return h.view('index');
    }
  },

  // favicon
  {
    method: 'GET',
    path: '/favicon.ico',
    handler(request: Request, h: ResponseToolkit) {
      return h
        .response(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛎️</text></svg>'
        )
        .type('image/svg+xml');
    }
  },

  // static files
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: rootPath('static')
      }
    }
  }
];
