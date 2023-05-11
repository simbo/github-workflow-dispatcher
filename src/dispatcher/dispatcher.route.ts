import { badRequest } from '@hapi/boom';
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { slashJoin } from 'path-slashes';

import { GITHUB_OAUTH } from '../auth/github-oauth.constants.js';
import { githubBaseURL } from '../config/config.js';
import { clientCache } from '../utils/client-cache.js';
import { debugLog } from '../utils/debug-log.js';

import { dispatchWorkflowRun, getWorkflowInputsFromQuery } from './dispatcher-utils.js';
import { DISPATCHER } from './dispatcher.constants.js';

export const dispatcherRoute: ServerRoute = {
  method: 'GET',
  path: '/dispatch/{owner}/{repo}/{ref}/{workflow}',
  options: {
    auth: GITHUB_OAUTH,
    validate: {
      params: Joi.object({
        owner: Joi.string().required(),
        repo: Joi.string().required(),
        ref: Joi.string().required(),
        workflow: Joi.string().required()
      })
    },
    cache: clientCache()
  },
  async handler(request: Request, h: ResponseToolkit) {
    const { owner, repo, ref, workflow } = request.params;

    const workflowFile = /\.ya?ml$/.test(workflow) ? workflow : `${workflow}.yml`;
    const workflowInputs = getWorkflowInputsFromQuery(request);

    try {
      const { token } = request.auth.artifacts as { token: string };
      await dispatchWorkflowRun(owner, repo, ref, workflowFile, workflowInputs, token);
      debugLog(request, [DISPATCHER], 'workflow dispatch succeeded');
    } catch (error) {
      debugLog(request, [DISPATCHER, 'error'], `workflow dispatch failed (${error})`);
      return badRequest(error as Error);
    }

    const workflowURL = slashJoin(githubBaseURL, owner, repo, 'actions/workflows', workflowFile);

    return h.view('dispatch', { owner, repo, ref, workflowFile, workflowInputs, workflowURL });
  }
};
