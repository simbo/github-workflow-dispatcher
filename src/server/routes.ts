import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import millisecond from 'millisecond';

import { GITHUB_OAUTH } from '../auth/github-oauth.constants.js';
import { isGHE } from '../config/config.js';
import { clientCache } from '../utils/client-cache.js';
import { rootPath } from '../utils/root-path.js';

export const routes: ServerRoute[] = [
  // welcome page
  {
    method: 'GET',
    path: '/',
    options: {
      auth: isGHE ? GITHUB_OAUTH : false,
      cache: clientCache()
    },
    handler(request: Request, h: ResponseToolkit) {
      return h.view('index');
    }
  },

  // favicon
  {
    method: 'GET',
    path: '/favicon.ico',
    options: {
      cache: clientCache('1 year')
    },
    handler(request: Request, h: ResponseToolkit) {
      return h
        .response(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛎️</text></svg>'
        )
        .header('Last-Modified', new Date('2023-05-10T12:00:00Z').toUTCString())
        .type('image/svg+xml');
    }
  },

  // static files
  {
    method: 'GET',
    path: '/{param*}',
    options: {
      cache: clientCache('1 year')
    },
    handler: {
      directory: {
        path: rootPath('static')
      }
    }
  }
];
