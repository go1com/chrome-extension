import {ContainerModule, interfaces} from "inversify";
import {LoadNotesForPageChromeCommandHandler} from "./commandHandlers/LoadNotesForPageChromeCommandHandler";

import {CheckQuickButtonSettingChromeCommandHandler} from "./commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {StartDiscussionChromeCommandHandler} from "./commandHandlers/startDiscussionChromeCommandHandler";
import {DiscussionNoFirebaseServiceService} from "../modules/discussions/services/discussionNoFirebase.service";
import {ICommandHandler, ICommandHandlerSymbol} from "../services/commandHandlerService/ICommandHandler";


const backgroundScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<DiscussionNoFirebaseServiceService>(DiscussionNoFirebaseServiceService).toSelf();

    bind<ICommandHandler>(ICommandHandlerSymbol).to(LoadNotesForPageChromeCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckQuickButtonSettingChromeCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(StartDiscussionChromeCommandHandler);
  }
);

export default backgroundScriptContainer;
