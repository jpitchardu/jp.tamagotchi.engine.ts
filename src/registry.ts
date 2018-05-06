/**
 * @description Main fndi registration function
 * @author jpichardo
 */

import * as bunyan from 'bunyan';
import { Server as GrpcServer } from 'grpc';

import { Server } from './server';

import { engineRegistration } from './engine';
import { EngineService, servicesRegistration } from './services';

/**
 * @param {string} env - Environment for configuration file
 * @returns {function} a fndi registration function
 */
export function registration(env = ''): (registry: any) => void {
  return registry => {
    engineRegistration(registry);
    servicesRegistration(registry);

    registry({
      name: 'config',
      value: require(env ? `./config/config.${env}` : './config/config').config
    });

    registry({
      factory: resolve =>
        bunyan.createLogger({ name: 'TSEngineServiceLogger' }),
      name: 'log'
    });
    registry({
      factory: resolve => className => resolve('log').child({ className }),
      name: 'logFactory'
    });

    registry({
      factory: resolve => {
        const services = [
          {
            implementation: resolve(EngineService),
            service: resolve('protoEngineService')
          }
        ];

        const grpcServer = new GrpcServer();

        const logFactory = resolve('logFactory');
        const config = resolve('config');

        return new Server(grpcServer, config, services, logFactory);
      },
      type: Server
    });
  };
}
