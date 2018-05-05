import { ServiceDefinition } from 'grpc';

export * from './engineService';

export * from './registry';

export interface IServiceDefinition<T> {
  service: ServiceDefinition<T>;
  implementation: T;
}
