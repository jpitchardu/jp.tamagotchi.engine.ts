import { Server as GrpcServer } from 'grpc';

import { Server } from './server';

import { require } from './utils/index';

import { EngineService } from './services/engineService';

export function registration(env) {
  return registry => {
    registry({ name: 'config', value: require(`config/config.${env}`) });

    registry({
      factory: resolve => {
        const services = [
          {
            implementation: resolve(EngineService),
            service: resolve('protoEngineService')
          }
        ];

        const grpcServer = new GrpcServer();

        const config = resolve('config');

        return new Server(grpcServer, config, services);
      },
      type: Server
    });
  };
}
