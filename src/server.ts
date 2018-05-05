import {
  Server as GrpcServer,
  ServerCredentials,
  ServiceDefinition
} from 'grpc';

import { IServiceDefinition } from '@services/index';

export class Server {
  private logger: any;

  constructor(
    private readonly grpcServer: GrpcServer,
    private readonly config: any,
    private readonly services: Array<IServiceDefinition<any>>,
    logFactory: (className: string) => any
  ) {
    this.services.forEach(service =>
      this.grpcServer.addService(service.service, service.implementation)
    );
    this.logger = logFactory('Server');
  }

  public start(): IServerStartResult {
    let result: IServerStartResult;

    const hostAddress = `${this.config.ip}:${this.config.port}`;

    this.logger.info(`Attempting to start server at ${hostAddress}`);

    try {
      this.grpcServer.bind(hostAddress, ServerCredentials.createInsecure());

      this.grpcServer.start();

      result = { message: 'Server Successfully Started', successful: true };

      this.logger.info(`Server successfully started at ${hostAddress}`);
    } catch (err) {
      this.logger.critical(
        `Failed to start server at ${hostAddress} with error: ${err}`
      );
      result = { message: err, successful: false };
    }

    return result;
  }
}

interface IServerStartResult {
  message: string;
  successful: boolean;
}
