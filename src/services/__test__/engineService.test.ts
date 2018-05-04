import * as scope from 'fndi';

import {
  EngineService,
  IExecutionRequest,
  IExecutionResponse
} from '@services/engineService';

import { Engine } from '@engine/engine';
import { ICallback } from '../../utils/index';

const mockFn = jest.fn;

class Fake {}
const ERROR_MSG = 'Execution Failed';

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
        let engineFake: Engine;
        let callbackMock: ICallback<IExecutionResponse>;

        beforeAll(() => {
          const sut = resolve(EngineService) as EngineService;

          engineFake = resolve(Engine) as Engine;

          callbackMock = mockFn();

          sut.execute({ fileName: 'dummyFile' }, callbackMock);
        });

        test('It should be successful', () => {
          expect(callbackMock).toHaveBeenCalledWith(null, { successful: true });
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
            render: mockFn().mockRejectedValue(ERROR_MSG)
          }
        });
        registry({ type: EngineService });
      },
      resolve => {
        let callbackMock: ICallback<IExecutionResponse>;

        let failEngineFake: Engine;

        beforeAll(() => {
          const sut = resolve(EngineService);

          failEngineFake = resolve(Engine);
          callbackMock = mockFn();

          sut.execute({ fileName: 'dummyFile' }, callbackMock);
        });

        test('It should not be successful', () => {
          expect(callbackMock).toHaveBeenCalledWith(null, {
            message: ERROR_MSG,
            successful: false
          });
        });

        test('It should have called Engine::render', () => {
          expect(failEngineFake.render).toHaveBeenCalledTimes(1);
        });
      }
    )
  );
});
