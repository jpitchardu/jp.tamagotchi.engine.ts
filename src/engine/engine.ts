import { VM, VMScript } from 'vm2';

import { promisify } from '../utils';

import * as fs from 'fs';
import * as util from 'util';

export class Engine {
  /**
   * @param  {VM} vm
   */
  constructor(private readonly vm: VM) {}

  /**
   * @param  {string} fileName
   * @returns Promise
   */
  public render<T>(fileName: string): Promise<T> {
    return promisify(fs.readFile)(fileName)
      .then((code: string) => new VMScript(code, fileName))
      .then(script => this.vm.run(script))
      .then(Clazz => new Clazz() as T);
  }
}
