import * as scope from 'fndi';

import { Server as GrpcServer, ServerCredentials } from 'grpc';

import { IServiceDefinition } from 'services';

import { IConfig } from '@config/configContract';

import { Server } from '../server';

const mockFn = jest.fn;

const registration = registry => {
  registry({
    name: 'grpcServer',
    value: {
      addService: mockFn(),
      bind: mockFn(),
      start: mockFn()
    }
  });

  registry({
    name: 'config',
    value: {
      ip: 'fakeIp',
      port: 0
    }
  });

  registry({
    name: 'services',
    value: [{ service: {}, implementation: {} }]
  });

  registry({ type: Server });
};

describe(
  'Given a server',
  scope(registration, resolve => {
    let sut: Server;

    let grpcServerFake: GrpcServer;
    let configFake: IConfig;
    let servicesFake: Array<IServiceDefinition<any>>;

    beforeAll(() => {
      sut = resolve(Server);

      grpcServerFake = resolve('grpcServer');
      configFake = resolve('Config');
      servicesFake = resolve('services');
    });

    test('It should have registered services', () => {
      servicesFake.forEach(service =>
        expect(grpcServerFake.addService).toHaveBeenCalledWith(
          service.service,
          service.implementation
        )
      );
    });

    describe('When asked to start', () => {
      beforeAll(() => {
        sut.start();
      });

      test('It should have binded and started the grpc server', () => {
        expect(grpcServerFake.bind).toHaveBeenCalledWith(
          `${configFake.ip}:${configFake.port}`,
          ServerCredentials.createInsecure()
        );

        expect(grpcServerFake.start).toHaveBeenCalled();
      });
    });
  })
);
