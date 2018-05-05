import { validate } from 'class-validator';
import * as scope from 'fndi';

import {
  EngineService,
  ExecutionRequest,
  ExecutionResponse
} from '../engineService';

import { Engine } from '../../engine';
import { ICallback } from '../../utils/index';

const mockFn = jest.fn;

class Fake {}
const ERROR_MSG = 'Execution Failed';

describe('Given an Engine When provided with a filename', () => {
  describe('When request is valid', () => {
    let request: ExecutionRequest;

    const scopeRegistration = registry => {
      registry({
        name: 'validate',
        value: mockFn().mockResolvedValue({})
      });
      registry({ type: EngineService });
    };

    beforeAll(() => {
      request = { fileName: 'dummyFile.ts' };
    });

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
          scopeRegistration(registry);
        },
        resolve => {
          let engineFake: Engine;
          let validateMock;
          let callbackMock: ICallback<ExecutionResponse>;

          beforeAll(() => {
            const sut = resolve(EngineService) as EngineService;

            engineFake = resolve(Engine) as Engine;
            validateMock = resolve('validate');

            callbackMock = mockFn();

            sut.execute(request, callbackMock);
          });

          test('It should have called validate', () => {
            expect(validateMock).toHaveBeenCalledWith(request);
          });

          test('It should be successful', () => {
            expect(callbackMock).toHaveBeenCalledWith(null, {
              successful: true
            });
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
          scopeRegistration(registry);
        },
        resolve => {
          let callbackMock: ICallback<ExecutionResponse>;

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

  describe(
    'When request is invalid',
    scope(
      registry => {
        registry({
          type: Engine,
          value: {
            render: mockFn()
          }
        });
        registry({
          name: 'validate',
          value: mockFn().mockRejectedValue('Validation Failed')
        });
        registry({ type: EngineService });
      },
      resolve => {
        let request: ExecutionRequest;

        let engineFake: Engine;
        let callbackMock: ICallback<ExecutionResponse>;
        let validateMock;

        beforeAll(() => {
          request = { fileName: 'dummyFile.txt' };

          const sut = resolve(EngineService) as EngineService;

          engineFake = resolve(Engine) as Engine;
          validateMock = resolve('validate');

          callbackMock = mockFn();

          sut.execute(request, callbackMock);
        });

        test('It should have called validate', () => {
          expect(validateMock).toHaveBeenCalledWith(request);
        });

        test('It should not be successful', () => {
          expect(callbackMock).toHaveBeenCalledWith(null, {
            message: 'Validation Failed',
            successful: false
          });
        });

        test('It should have not called Engine::render', () => {
          expect(engineFake.render).toHaveBeenCalledTimes(0);
        });
      }
    )
  );
});
