import Reflect from "reflect-metadata/Reflect";

import {Container} from "inversify";
import {IStorageService, IStorageServiceSymbol} from "../services/storageService/IStorageService";
import {DefaultStorageService} from "../services/storageService/StorageService";
import {DefaultRestClientService} from "../services/restClientService/RestClientService";
import {
  IChromeCmdHandleService, IChromeCmdHandleServiceSymbol
} from "../services/chromeCommandHandlerService/IChromeCmdHandleService";
import {IRestClientService, IRestClientServiceSymbol} from "../services/restClientService/IRestClientService";
import {ChromeCmdHandleService} from "../services/chromeCommandHandlerService/ChromeCmdHandleService";

const container = new Container();
container.bind<IStorageService>(IStorageServiceSymbol).to(DefaultStorageService);
container.bind<IRestClientService>(IRestClientServiceSymbol).to(DefaultRestClientService);
container.bind<IChromeCmdHandleService>(IChromeCmdHandleServiceSymbol).to(ChromeCmdHandleService);

export default container;
