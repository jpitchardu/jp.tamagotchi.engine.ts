import { ServiceDefinition } from 'grpc';

export * from './engineService';

export interface IServiceDefinition<T> {
  service: ServiceDefinition<T>;
  implementation: T;
}
