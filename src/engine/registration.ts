import { Engine } from '@engine/engine';
import { VM } from 'vm2';

export function engineRegistration(registry) {
  registry({ type: VM });
  registry({ type: Engine });
}
