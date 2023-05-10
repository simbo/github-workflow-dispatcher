import { Request } from '@hapi/hapi';
import { Octokit } from '@octokit/rest';

import { githubApiURL } from '../config/config.js';

export function getWorkflowInputsFromQuery(request: Request): { [key: string]: string } {
  return Object.entries(request.query).reduce((inputs, [key, value], index) => {
    if (index < 10) {
      inputs[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return inputs;
  }, {});
}

export async function dispatchWorkflowRun(
  owner: string,
  repo: string,
  ref: string,
  workflowFile: string,
  workflowInputs: { [key: string]: string },
  token: string
): Promise<void> {
  const octokit = new Octokit({
    baseUrl: githubApiURL,
    auth: token
  });
  await octokit.actions.createWorkflowDispatch({
    owner,
    repo,
    ref,
    workflow_id: workflowFile,
    inputs: workflowInputs
  });
}
