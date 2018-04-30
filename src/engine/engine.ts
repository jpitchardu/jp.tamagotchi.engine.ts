import { VM, VMScript } from 'vm2';

import { promisify, require } from '../utils/index';

import * as fs from 'fs';
import * as util from 'util';

export class Engine {
  constructor(private vm: VM) {}

  public render<T>(fileName): Promise<T> {
    return promisify(fs.readFile)(fileName)
      .then(code => new VMScript(code))
      .then(script => this.vm.run(script))
      .then(Clazz => new Clazz() as T);
  }
}
