import * as scope from 'fndi';

import { registration } from './registry';
import { Server } from './server';

function main(resolve) {
  // const log = resolve('log');
  const server = resolve(Server);

  const result = server.start();

  // result.Esta semana ? log.critical(result.message) : log.info('Server started');
}

const scopedMain = scope(registration, main)();
