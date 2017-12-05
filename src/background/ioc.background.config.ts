import {ContainerModule, interfaces} from "inversify";
import {LoadNotesForPageChromeCommandHandler} from "./commandHandlers/LoadNotesForPageChromeCommandHandler";

import {CheckQuickButtonSettingChromeCommandHandler} from "./commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {StartDiscussionChromeCommandHandler} from "./commandHandlers/startDiscussionChromeCommandHandler";
import {DiscussionNoFirebaseServiceService} from "../modules/discussions/services/discussionNoFirebase.service";
import {ICommandHandler, ICommandHandlerSymbol} from "../services/commandHandlerService/ICommandHandler";
import {CheckHighlightSettingChromeCommandHandler} from "./commandHandlers/checkHighlightSettingChromeCommandHandler";
import {CheckCreateNoteMenuSettingChromeCommandHandler} from "./commandHandlers/checkCreateNoteMenuSettingChromeCommandHandler";
import { OnPortalChangedChromeCommandHandler } from "./commandHandlers/onPortalChangedChromeCommandHandler";


const backgroundScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<DiscussionNoFirebaseServiceService>(DiscussionNoFirebaseServiceService).toSelf();

    bind<ICommandHandler>(ICommandHandlerSymbol).to(LoadNotesForPageChromeCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(OnPortalChangedChromeCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckQuickButtonSettingChromeCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckCreateNoteMenuSettingChromeCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckHighlightSettingChromeCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(StartDiscussionChromeCommandHandler);
  }
);

export default backgroundScriptContainer;
