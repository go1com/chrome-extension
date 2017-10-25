export const IStorageServiceSymbol = Symbol("IStorageService");

export interface IStorageService {
  exists(key: string): boolean;

  retrieve(key: string);

  store(key: string, value: any);

  remove(key: string);

  clear();
}
