import { isBoom } from '@hapi/boom';
import { Plugin, Request, ResponseToolkit, Server } from '@hapi/hapi';

export const errorHandlingPlugin: Plugin<never> = {
  name: 'error-handling',

  async register(server: Server) {
    server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
      if (!isBoom(request.response)) {
        return h.continue;
      }

      const boom = request.response;
      const { statusCode, payload } = boom.output;
      const statusText = payload.error;
      const message = payload.message === statusText ? '' : payload.message;

      const emoji = (() => {
        if (statusCode === 404) return '🤷‍♂️';
        if (statusCode >= 400 && statusCode < 500) return '👮‍♂️';
        return '💥';
      })();

      return h.view('error', { emoji, statusCode, statusText, message }).code(statusCode);
    });
  }
};
