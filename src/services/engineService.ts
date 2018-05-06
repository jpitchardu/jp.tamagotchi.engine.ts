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
    this.validate(request) // Validate request using  class-validator
      .then(() => this.engine.render(request.fileName)) // Render the file
      .then(res => ({ successful: true })) // Map to successful request
      .catch(err => ({ message: err.toString(), successful: false })) // Map to failed request
      .then(response => callback(null, response)); // Execute callback
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
