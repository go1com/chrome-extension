import {ContainerModule, interfaces} from "inversify";
import {LoadNotesForPageChromeCommandHandler} from "./commandHandlers/LoadNotesForPageChromeCommandHandler";
import {
  IChromeCommandHandler,
  IChromeCommandHandlerSymbol
} from "../services/chromeCommandHandlerService/IChromeCommandHandler";
import {CheckQuickButtonSettingChromeCommandHandler} from "./commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {StartDiscussionChromeCommandHandler} from "./commandHandlers/startDiscussionChromeCommandHandler";
import {DiscussionNoFirebaseServiceService} from "../modules/discussions/services/discussionNoFirebase.service";


const backgroundScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<DiscussionNoFirebaseServiceService>(DiscussionNoFirebaseServiceService).toSelf();

    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(LoadNotesForPageChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(CheckQuickButtonSettingChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(StartDiscussionChromeCommandHandler);
  }
);

export default backgroundScriptContainer;
