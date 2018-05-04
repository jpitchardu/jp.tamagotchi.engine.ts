import * as scope from 'fndi';

import {
  EngineService,
  IExecutionRequest,
  IExecutionResponse
} from '@services/engineService';

import { Engine } from '@engine/engine';

const mockFn = jest.fn;

class Fake {}

describe('Given an Engine When provided with a filename', () => {
  describe(
    'And execution succeds',
    scope(
      registry => {
        registry({
          type: Engine,
          value: {
            render: mockFn().mockResolvedValue(new Fake())
          }
        });
        registry({ type: EngineService });
      },
      resolve => {
        let result: IExecutionResponse;
        let engineFake: Engine;

        beforeAll(async () => {
          const sut = resolve(EngineService) as EngineService;

          engineFake = resolve(Engine) as Engine;

          result = await sut.execute({ fileName: 'dummyFile' });
        });

        test('It should be successful', () => {
          expect(result.successful).toBe(true);
        });

        test('It should have called Engine::render', () => {
          expect(engineFake.render).toHaveBeenCalledTimes(1);
        });
      }
    )
  );

  describe(
    'And execution fails',
    scope(
      registry => {
        registry({
          type: Engine,
          value: {
            render: mockFn().mockRejectedValue('Execution fail')
          }
        });
        registry({ type: EngineService });
      },
      resolve => {
        let failResult: IExecutionResponse;
        let failEngineFake: Engine;

        beforeAll(async () => {
          failEngineFake = resolve(Engine);
          const sut = resolve(EngineService);

          failEngineFake = resolve(Engine);

          failResult = await sut.execute({ fileName: 'dummyFile' });
        });

        test('It should not be successful', () => {
          expect(failResult.successful).toBe(false);
        });

        test('It should have called Engine::render', () => {
          expect(failEngineFake.render).toHaveBeenCalledTimes(1);
        });
      }
    )
  );
});
