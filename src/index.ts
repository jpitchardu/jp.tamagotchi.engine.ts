import scope from 'fndi';
import { Server } from './server';

function main(resolve) {
  const server = resolve(Server);

  server.start();
}

const scopedMain = scope(main);
