import { VM, VMScript } from 'vm2';

import { promisify } from '@utils/index';

import * as fs from 'fs';
import * as util from 'util';

export class Engine {
  constructor(private vm: VM) {}

  public render<T>(fileName: string): Promise<T> {
    return promisify(fs.readFile)(fileName)
      .then((code: string) => new VMScript(code, fileName))
      .then(script => this.vm.run(script))
      .then(Clazz => new Clazz() as T);
  }
}
