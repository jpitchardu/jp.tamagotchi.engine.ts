import scope from 'fndi';
import { Server } from './server';

function main(resolve) {
  const log = resolve('log');
  const server = resolve(Server);

  const result = server.start();

  result.successful ? log.critical(result.message) : log.info('Server started');
}

const scopedMain = scope(main);
