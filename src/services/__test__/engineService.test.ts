import * as scope from 'fndi';

const mockFn = jest.fn();

import {
  EngineService,
  IExecutionRequest,
  IExecutionResponse
} from '../engineService';

import { Engine } from '../../engine/engine';

class Fake {}

describe('Given an Engine When provided with a filename', () => {
  describe('And execution succeds', () => {
    let result: IExecutionResponse;
    let engineFake: Engine;

    beforeAll(
      scope(
        registry => {
          registry({
            type: Engine,
            value: {
              render: mockFn.mockReturnValue(Promise.resolve<Fake>(new Fake()))
            }
          });
          registry({
            type: EngineService
          });
        },
        async resolve => {
          const sut = resolve(EngineService) as EngineService;

          engineFake = resolve(Engine) as Engine;

          result = await sut.execute({ fileName: 'dummyFile' });
        }
      )
    );

    test('It should be successful', () => {
      expect(result.successful).toBe(true);
    });

    test('It should have called Engine::render', () => {
      expect(engineFake.render).toHaveBeenCalledTimes(1);
    });
  });

  describe('And execution fails', () => {
    let failResult: IExecutionResponse;
    let failEngineFake;

    beforeAll(
      scope(
        registry => {
          registry({
            type: Engine,
            value: {
              render: mockFn.mockReturnValue(Promise.reject<Fake>(new Fake()))
            }
          });
          registry({
            type: EngineService
          });
        },
        async resolve => {
          failEngineFake = resolve(Engine);
          const sut = resolve(EngineService);

          // failEngineFake = resolve(Engine) as Engine;

          failResult = await sut.execute({ fileName: 'dummyFile' });
        }
      )
    );

    test('It should not be successful', () => {
      expect(failResult.successful).toBe(false);
    });

    test('It should have called Engine::render', () => {
      expect(failEngineFake.render).toHaveBeenCalledTimes(1);
    });
  });
});
