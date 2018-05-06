import * as scope from 'fndi';

import { registration } from './registry';
import { Server } from './server';

function main(resolve) {

  const log = resolve('log');
  const server = resolve(Server) as Server;


  // Start server
  const result = server.start();

  // Log server result
  (result.successful ? log.info : log.fatal).bind(log)(result.message);
}

const scopedMain = scope(registration(), main)();
