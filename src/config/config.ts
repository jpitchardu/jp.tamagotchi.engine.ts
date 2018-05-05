import { IConfig } from '@config/configContract';

export const config: IConfig = {
  engineProtoPath: __dirname + '/../proto/executionService.proto',
  ip: '127.0.0.1',
  port: 2222
};
