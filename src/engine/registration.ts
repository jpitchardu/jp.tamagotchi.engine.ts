import { VM } from 'vm2';

import { Engine } from './engine';

export function engineRegistration(registry) {
  registry({ type: VM });
  registry({ type: Engine });
}
