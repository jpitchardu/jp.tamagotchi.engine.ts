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
    return promisify(fs.readFile)(fileName) // Read File
      .then((code: string) => new VMScript(code, fileName)) // Create script
      .then(script => this.vm.run(script)) // Run sandboxed script
      .then(Clazz => new Clazz() as T); // Return instance
  }
}
