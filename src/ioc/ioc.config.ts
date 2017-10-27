import Reflect from "reflect-metadata/Reflect";

import {Container} from "inversify";
import {IStorageService, IStorageServiceSymbol} from "../services/storageService/IStorageService";
import {DefaultStorageService} from "../services/storageService/StorageService";
import {DefaultRestClientService} from "../services/restClientService/RestClientService";
import {IRestClientService, IRestClientServiceSymbol} from "../services/restClientService/IRestClientService";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../services/browserMessagingService/IBrowserMessagingService";
import {ChromeMessagingService} from "../services/browserMessagingService/chromeMessagingService";
import {
  ICommandHandlerService,
  ICommandHandlerServiceSymbol
} from "../services/commandHandlerService/ICommandHandlerService";
import {CommandHandlerService} from "../services/commandHandlerService/CommandHandlerService";

const container = new Container();

container.bind<IStorageService>(IStorageServiceSymbol).to(DefaultStorageService);

container.bind<IRestClientService>(IRestClientServiceSymbol).to(DefaultRestClientService);

container.bind<ICommandHandlerService>(ICommandHandlerServiceSymbol).to(CommandHandlerService);

container.bind<IBrowserMessagingService>(IBrowserMessagingServiceSymbol).to(ChromeMessagingService);

export default container;
