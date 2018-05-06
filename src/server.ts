import {
  Server as GrpcServer,
  ServerCredentials,
  ServiceDefinition
} from 'grpc';

import { IServiceDefinition } from './services';

export class Server {
  private logger: any;

  /**
   * @param  {GrpcServer} grpcServer
   * @param  {any} config
   * @param  {Array<IServiceDefinition<any>>} services
   * @param  {(className:string)=>any} logFactory
   */
  constructor(
    private readonly grpcServer: GrpcServer,
    private readonly config: any,
    private readonly services: Array<IServiceDefinition<any>>,
    logFactory: (className: string) => any
  ) {
    // Register Services
    this.services.forEach(service =>
      this.grpcServer.addService(service.service, service.implementation)
    );

    // Instantiate Logger
    this.logger = logFactory('Server');
  }
  
  /**
   * @returns IServerStartResult
   */
  public start(): IServerStartResult {
    let result: IServerStartResult;

    const hostAddress = `${this.config.ip}:${this.config.port}`;

    this.logger.info(`Attempting to start server at ${hostAddress}`);

    try {

      // Bind grpcServer
      this.grpcServer.bind(hostAddress, ServerCredentials.createInsecure());

      // Start grpcServer
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
