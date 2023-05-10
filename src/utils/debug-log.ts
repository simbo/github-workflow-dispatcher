import { Request, Server } from '@hapi/hapi';

export function debugLog(context: Request | Server, tags: string[], message: string): void {
  const messagePrefix = (context as Server).version
    ? ''
    : `${(context as Request).info.remoteAddress} ${(context as Request).path}`;
  context.log(['debug', ...tags], `${messagePrefix} ${message}`);
}
