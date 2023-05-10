import { exit } from 'node:process';

import { startServer } from './server/server.js';

try {
  const server = await startServer();
  server.log(['info'], `Server running at ${server.info.uri}`);
} catch (error) {
  console.error(error);
  exit(1);
}
