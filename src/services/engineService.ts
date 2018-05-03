import { Engine } from '../engine/engine';

export class EngineService {
  constructor(private readonly engine: Engine) {}

  public execute(request: IExecutionRequest): Promise<IExecutionResponse> {
    return this.engine
      .render(request.fileName)
      .then(res => ({ successful: true }))
      .catch(err => ({ message: err.toString(), successful: false }));
  }
}

export interface IExecutionRequest {
  fileName: string;
}

export interface IExecutionResponse {
  message?: string;
  successful: boolean;
}
