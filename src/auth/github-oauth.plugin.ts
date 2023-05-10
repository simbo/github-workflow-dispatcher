import { Plugin, Request, ResponseToolkit, Server } from '@hapi/hapi';

import { isHTTPS } from '../config/config.js';
import { debugLog } from '../utils/debug-log.js';

import { githubOauthScheme } from './github-oauth-scheme.js';
import { GITHUB_OAUTH, GITHUB_OAUTH_CALLBACK_PATH, GITHUB_OAUTH_COOKIE } from './github-oauth.constants.js';

/**
 * Hapi Plugin for GitHub OAuth
 */
export const githubOauthPlugin: Plugin<never> = {
  name: GITHUB_OAUTH,

  async register(server: Server) {
    // setup the cookie to store the auth data
    server.state(GITHUB_OAUTH_COOKIE, {
      ttl: 1000 * 60 * 60 * 24 * 30, // 30 days
      isSecure: isHTTPS,
      isHttpOnly: true,
      encoding: 'none', // cookie data is already encrypted
      clearInvalid: true,
      strictHeader: true,
      path: '/'
    });

    // create and register auth scheme
    server.auth.scheme(GITHUB_OAUTH, githubOauthScheme);
    server.auth.strategy(GITHUB_OAUTH, GITHUB_OAUTH);

    // after oauth process, return to the route that initiated authentication
    server.route({
      method: 'GET',
      path: GITHUB_OAUTH_CALLBACK_PATH,
      options: {
        auth: GITHUB_OAUTH
      },
      handler(request: Request, h: ResponseToolkit) {
        const { returnTo: returnToEncoded } = request.query;
        if (returnToEncoded) {
          const returnTo = Buffer.from(returnToEncoded, 'base64').toString('utf8');
          debugLog(request, [GITHUB_OAUTH], 'redirecting to original url');
          return h.redirect(returnTo);
        } else {
          debugLog(request, [GITHUB_OAUTH], 'no return url present, redirecting to base url');
          return h.redirect('/');
        }
      }
    });
  }
};
