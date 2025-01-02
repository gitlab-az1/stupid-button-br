export interface Service<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse> | TResponse;
}

export default Service;
