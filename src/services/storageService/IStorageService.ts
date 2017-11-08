export const IStorageServiceSymbol = Symbol("IStorageService");

export interface IStorageService {
  exists(key: string): Promise<boolean>;

  retrieve(key: string): Promise<any>;

  store(key: string, value: any): Promise<any>;

  remove(key: string): Promise<any>;

  clear(): Promise<any>;
}
