import {
  Server as GrpcServer,
  ServerCredentials,
  ServiceDefinition
} from 'grpc';

import { IServiceDefinition } from './services';

export class Server {
  private server: GrpcServer;

  constructor(
    private grpcServer: GrpcServer,
    private config: any,
    private services: Array<IServiceDefinition<any>>
  ) {
    this.services.forEach(service =>
      this.server.addService(service.service, service.implementation)
    );
  }

  public start() {
    this.server.bind(
      `${this.config.ip}:${this.config.port}`,
      ServerCredentials.createInsecure()
    );
  }
}
