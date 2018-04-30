import { promisify } from '../utils/index';

export class EngineService {
  constructor(private readonly protoEngineService) {
    this.protoEngineService.execute = promisify(
      this.protoEngineService.execute
    );
  }

  public execute(request: IExecutionRequest): Promise<IExecutionResponse> {
    return this.protoEngineService
      .execute(request)
      .then(res => res as IExecutionResponse);
  }
}

export interface IExecutionRequest {
  fileName: string;
}

export interface IExecutionResponse {
  successful: boolean;
}
