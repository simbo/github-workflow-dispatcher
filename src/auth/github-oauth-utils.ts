import { Request } from '@hapi/hapi';
import { createOAuthUserAuth } from '@octokit/auth-oauth-app';
import { request as octokitRequest } from '@octokit/request';
import { Octokit } from '@octokit/rest';

import { baseURL, githubApiURL, githubAppID, githubAppSecret, githubBaseURL } from '../config/config.js';

import { GITHUB_OAUTH_CALLBACK_PATH } from './github-oauth.constants.js';

/**
 * Retrieve the GitHub OAuth user token from received OAuth code
 */
export async function getGitHubOauthUserTokenFromCode(code: string): Promise<string> {
  const auth = createOAuthUserAuth({
    clientId: githubAppID,
    clientSecret: githubAppSecret,
    code,
    request: octokitRequest.defaults({
      baseUrl: githubApiURL
    })
  });
  const { token } = await auth();
  return token;
}

/**
 * Validate the GitHub OAuth user token by retrieving the profile of the authenticated user
 */
export async function validateGitHubOauthUserToken(token: string): Promise<void> {
  const octokit = new Octokit({ baseUrl: githubApiURL, auth: token });
  await octokit.users.getAuthenticated();
}

/**
 * Generate the GitHub OAuth authorization URL with dynamic return URL as query param
 */
export function getGitHubOauthURL(request: Request): string {
  // build a URI to the route that emitted the auth process
  const returnURI = `${request.url.pathname}${request.url.search.length > 0 ? `?${request.url.search}` : ''}`;

  // build the redirect URL to where the user returns after the github authorization
  const redirectURL = new URL(baseURL);
  redirectURL.pathname = GITHUB_OAUTH_CALLBACK_PATH;
  const redirectParams = new URLSearchParams({
    returnTo: Buffer.from(returnURI.toString()).toString('base64')
  });
  redirectURL.search = redirectParams.toString();

  // build the oauth url to where the user is redirected to authorize
  const oauthURL = new URL(githubBaseURL);
  oauthURL.pathname = '/login/oauth/authorize';
  const oauthParams = new URLSearchParams({
    client_id: githubAppID,
    redirect_uri: redirectURL.toString(),
    scope: 'repo',
    allow_signup: 'false'
  });
  oauthURL.search = oauthParams.toString();

  return oauthURL.toString();
}
