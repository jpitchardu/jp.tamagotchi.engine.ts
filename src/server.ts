import {
  Server as GrpcServer,
  ServerCredentials,
  ServiceDefinition
} from 'grpc';

import { IServiceDefinition } from '@services/index';

export class Server {
  private server: GrpcServer;

  constructor(
    private grpcServer: GrpcServer,
    private config: any,
    private services: Array<IServiceDefinition<any>>
  ) {
    this.services.forEach(service =>
      this.grpcServer.addService(service.service, service.implementation)
    );
  }

  public start(): IServerStartResult {
    let result: IServerStartResult;

    try {
      this.grpcServer.bind(
        `${this.config.ip}:${this.config.port}`,
        ServerCredentials.createInsecure()
      );

      this.grpcServer.start();

      result = { message: 'Server Successfully Started', successful: true };
    } catch (err) {
      result = { message: err, successful: false };
    }

    return result;
  }
}

interface IServerStartResult {
  message: string;
  successful: boolean;
}
