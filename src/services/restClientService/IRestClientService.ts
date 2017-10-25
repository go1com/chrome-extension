export const IRestClientServiceSymbol = Symbol("IRestClientService");

export interface IRestClientService {
  getUrls: any[];

  request<T>(url: string, type: string, data?: any, customHeaders?: any) ;

  head<T>(url: string);

  get<T>(url: string, customHeaders?: any);

  singleGet<T>(url: string, customHeaders?: any);

  post<T>(url: string, data?: any, customHeaders?: any);

  put<T>(url: string, data?: any, customHeaders?: any);

  delete<T>(url: string, customHeaders?: any) ;
}
