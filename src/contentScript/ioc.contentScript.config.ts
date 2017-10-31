import {ContainerModule, interfaces} from "inversify";
import {PopupContainer} from "./components/popupContainerComponent/popupContainer";

import {GetLinkPreviewCommandHandler} from "./commandHandlers/GetLinkPreviewChromeCommandHandler";
import {JumpToQuoteTextCommandHandler} from "./commandHandlers/jumpToQuoteTextChromeCommandHandler";
import {RemoveAllHighlightCommandHandler} from "./commandHandlers/removeAllHighlightChromeCommandHandler";
import {ToggleExtensionPopupCommandHandler} from "./commandHandlers/ToggleExtensionPopupChromeCommandHandler";
import {CheckQuickButtonSettingCommandHandler} from "./commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {CheckCreateNoteSettingCommandHandler} from "./commandHandlers/checkCreateNoteSettingChromeCommandHandler";
import {CheckHighlightSettingCommandHandler} from "./commandHandlers/checkHighlightSettingChromeCommandHandler";

import {LinkPreview} from "../modules/linkPreviewer/linkPreviewService";
import {FabButtonsComponent} from "./components/fabButtonsComponent/fabButtonsComponent";
import {DocumentComponent} from "./components/injectionAreaComponent/documentComponent";
import {InjectionAreaComponent} from "./components/injectionAreaComponent/injectionAreaComponent";
import {ToolTipMenuComponent} from "./components/tooltipComponent/toolTipsMenu";
import {ICommandHandler, ICommandHandlerSymbol} from "../services/commandHandlerService/ICommandHandler";
import {ChromeMessagingService} from "../services/browserMessagingService/chromeMessagingService";
import {HighlightService} from "./services/highlightService";
import {StartDiscussionFromContextMenuCommandHandler} from "./commandHandlers/startDiscussionFromContextMenuCommandHandler";
import {AddToPortalFromContextMenuCommandHandler} from "./commandHandlers/addToPortalFromContextMenuCommandHandler";

const contentScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<DocumentComponent>(DocumentComponent).toSelf().inSingletonScope();
    bind<PopupContainer>(PopupContainer).toSelf().inSingletonScope();
    bind<InjectionAreaComponent>(InjectionAreaComponent).toSelf().inSingletonScope();
    bind<FabButtonsComponent>(FabButtonsComponent).toSelf().inSingletonScope();

    bind<HighlightService>(HighlightService).toSelf().inSingletonScope();

    bind<ToolTipMenuComponent>(ToolTipMenuComponent).toSelf().inTransientScope();

    bind<LinkPreview>(LinkPreview).toSelf();

    bind<ChromeMessagingService>(ChromeMessagingService).toSelf();

    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckQuickButtonSettingCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckHighlightSettingCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(CheckCreateNoteSettingCommandHandler);

    bind<ICommandHandler>(ICommandHandlerSymbol).to(GetLinkPreviewCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(AddToPortalFromContextMenuCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(StartDiscussionFromContextMenuCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(JumpToQuoteTextCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(RemoveAllHighlightCommandHandler);
    bind<ICommandHandler>(ICommandHandlerSymbol).to(ToggleExtensionPopupCommandHandler);
  }
);

export default contentScriptContainer;
