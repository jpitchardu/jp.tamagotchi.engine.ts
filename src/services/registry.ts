import * as grpc from 'grpc';

import { EngineService } from './engineService';

function businessProtoPackageSelector(load, selector) {
  return selector(load.jp.tamagotchi.engine);
}

export function registration(registry) {
  registry({
    factory: resolve => {
      const config = resolve('config');
      const path = config.protoServicesPaths.engineService;

      return businessProtoPackageSelector(
        grpc.load(`${config.protoPath}/${path}`),
        protoPackage => protoPackage.engine
      ).EngineService.service;
    },
    name: 'protoEngineService',
    persist: true
  });
  registry({ type: EngineService });
}
