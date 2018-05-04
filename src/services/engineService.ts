import { Engine } from '../engine/engine';

import { ICallback } from '@utils/index';

export class EngineService {
  constructor(private readonly engine: Engine) {}

  public execute(
    request: IExecutionRequest,
    callback: ICallback<IExecutionResponse>
  ) {
    this.engine
      .render(request.fileName)
      .then(res => ({ successful: true }))
      .catch(err => ({ message: err.toString(), successful: false }))
      .then(response => callback(null, response));
  }
}

export interface IExecutionRequest {
  fileName: string;
}

export interface IExecutionResponse {
  message?: string;
  successful: boolean;
}
