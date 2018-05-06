import { Matches, ValidationError, ValidatorOptions } from 'class-validator';

import { Engine } from '../engine/engine';

import { ICallback } from '../utils';

type validateFn = (
  object: object,
  validatorOptions?: ValidatorOptions
) => Promise<ValidationError[]>;

export class EngineService {
  /**
   * @param  {Engine} privatereadonlyengine
   * @param  {validateFn} privatereadonlyvalidate
   */
  constructor(
    private readonly engine: Engine,
    private readonly validate: validateFn
  ) {}

  /**
   * @param  {ExecutionRequest} request
   * @param  {ICallback<ExecutionResponse>} callback
   */
  public execute(
    request: ExecutionRequest,
    callback: ICallback<ExecutionResponse>
  ) {
    this.validate(request)
      .then(() => this.engine.render(request.fileName))
      .then(res => ({ successful: true }))
      .catch(err => ({ message: err.toString(), successful: false }))
      .then(response => callback(null, response));
  }
}

export class ExecutionRequest {
  @Matches(/^.*\.(ts)|(js)$/, { message: 'fileName is invalid' })
  public fileName: string;
}

export class ExecutionResponse {
  public message?: string;
  public successful: boolean;
}
