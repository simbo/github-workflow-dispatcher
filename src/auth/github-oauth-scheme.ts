import { badRequest } from '@hapi/boom';
import { Request, ResponseToolkit, ServerAuthSchemeObject } from '@hapi/hapi';

import { debugLog } from '../utils/debug-log.js';
import { decrypt, encrypt } from '../utils/encrypt-decrypt.js';

import {
  getGitHubOauthURL,
  getGitHubOauthUserTokenFromCode,
  validateGitHubOauthUserToken
} from './github-oauth-utils.js';
import { GITHUB_OAUTH, GITHUB_OAUTH_CALLBACK_PATH, GITHUB_OAUTH_COOKIE } from './github-oauth.constants.js';

/**
 * Hapi Auth Scheme for GitHub OAuth using a cookie to store the encrypted user token
 */
export function githubOauthScheme(): ServerAuthSchemeObject {
  return {
    async authenticate(request: Request, h: ResponseToolkit) {
      // try to retrieve an auth cookie
      if (request.state && request.state[GITHUB_OAUTH_COOKIE]) {
        debugLog(request, [GITHUB_OAUTH], 'cookie present');
        try {
          // decrypt the cookie to get user token
          const token = decrypt<string>(request.state[GITHUB_OAUTH_COOKIE]);
          debugLog(request, [GITHUB_OAUTH], 'cookie successfully decrypted');

          // check if the token is still valid
          await validateGitHubOauthUserToken(token);
          debugLog(request, [GITHUB_OAUTH], 'user token valid');

          // renew the cookie
          h.state(GITHUB_OAUTH_COOKIE, request.state[GITHUB_OAUTH_COOKIE]);
          debugLog(request, [GITHUB_OAUTH], 'cookie renewed');

          // approve authentication and provide user token as artifact
          return h.authenticated({ credentials: {}, artifacts: { token } });
        } catch (error) {
          debugLog(request, [GITHUB_OAUTH, 'error'], `cookie auth failed (${error})`);

          // delete the invalid cookie
          h.unstate(GITHUB_OAUTH_COOKIE);
        }
      } else {
        debugLog(request, [GITHUB_OAUTH], 'no cookie present');
      }

      // if not on the callback route, redirect to oauth authorize url
      if (request.route.path !== GITHUB_OAUTH_CALLBACK_PATH) {
        const oauthURL = getGitHubOauthURL(request);
        debugLog(request, [GITHUB_OAUTH], 'redirecting to github auth');
        return h.redirect(oauthURL).takeover();
      }

      // try to get the oauth code from the query params
      const { code } = request.query;

      // if no code present, throw bad request
      if (!code) {
        debugLog(request, [GITHUB_OAUTH], 'no oauth code present');
        throw badRequest();
      }

      try {
        // retrieve the user token from the given code
        const token = await getGitHubOauthUserTokenFromCode(code);
        debugLog(request, [GITHUB_OAUTH], 'user token received for code');

        // encrypt the token and store it as cookie
        const encryptedToken = encrypt(token);
        h.state(GITHUB_OAUTH_COOKIE, encryptedToken);
        debugLog(request, [GITHUB_OAUTH], 'encrypted user token stored in cookie');

        // approve authentication and provide user token as artifact
        debugLog(request, [GITHUB_OAUTH], 'auth succeeded');
        return h.authenticated({ credentials: {}, artifacts: { token } });

        // if there were errors, cancel authentication
      } catch (error) {
        debugLog(request, [GITHUB_OAUTH, 'error'], `auth failed (${error})`);
        return h.unauthenticated(error as Error);
      }
    }
  };
}
