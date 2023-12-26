export interface AjaxResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface AjaxResponseMessage {
  code: number;
  message: string;
}



export interface AjaxRequest<T> {
  (): Promise<AjaxResponse<T>>;
}

