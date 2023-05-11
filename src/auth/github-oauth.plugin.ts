import { Plugin, Server } from '@hapi/hapi';

import { cookieTTL, isHTTPS } from '../config/config.js';

import { githubOauthScheme } from './github-oauth-scheme.js';
import { GITHUB_OAUTH, GITHUB_OAUTH_COOKIE } from './github-oauth.constants.js';
import { githubOauthRoute } from './github-oauth.route.js';

/**
 * Hapi Plugin for GitHub OAuth
 */
export const githubOauthPlugin: Plugin<never> = {
  name: GITHUB_OAUTH,

  async register(server: Server) {
    // setup the cookie to store the auth data
    server.state(GITHUB_OAUTH_COOKIE, {
      ttl: cookieTTL,
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
    server.route(githubOauthRoute);
  }
};
