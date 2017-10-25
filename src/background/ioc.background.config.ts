import {ContainerModule, interfaces} from "inversify";
import {LoadNotesForPageChromeCommandHandler} from "./commandHandlers/LoadNotesForPageChromeCommandHandler";
import {
  IChromeCommandHandler,
  IChromeCommandHandlerSymbol
} from "../services/chromeCommandHandlerService/IChromeCommandHandler";


const backgroundScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(LoadNotesForPageChromeCommandHandler);
  }
);

export default backgroundScriptContainer;
