import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { clientCache } from '../utils/client-cache.js';
import { debugLog } from '../utils/debug-log.js';

import { GITHUB_OAUTH, GITHUB_OAUTH_CALLBACK_PATH } from './github-oauth.constants.js';

export const githubOauthRoute: ServerRoute = {
  method: 'GET',
  path: GITHUB_OAUTH_CALLBACK_PATH,
  options: {
    auth: GITHUB_OAUTH,
    cache: clientCache()
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
};
