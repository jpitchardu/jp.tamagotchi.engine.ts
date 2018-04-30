import { ServiceDefinition } from 'grpc';

export interface IServiceDefinition<T> {
  service: ServiceDefinition<T>;
  implemetation: T;
}
