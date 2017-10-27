import {ContainerModule, interfaces} from "inversify";
import {PopupContainer} from "./components/popupContainerComponent/popupContainer";
import {
  IChromeCommandHandler,
  IChromeCommandHandlerSymbol
} from "../services/chromeCommandHandlerService/IChromeCommandHandler";
import {GetLinkPreviewChromeCommandHandler} from "./commandHandlers/GetLinkPreviewChromeCommandHandler";
import {JumpToQuoteTextChromeCommandHandler} from "./commandHandlers/jumpToQuoteTextChromeCommandHandler";
import {RemoveAllHighlightChromeCommandHandler} from "./commandHandlers/removeAllHighlightChromeCommandHandler";
import {ToggleExtensionPopupChromeCommandHandler} from "./commandHandlers/ToggleExtensionPopupChromeCommandHandler";
import {LinkPreview} from "../modules/linkPreviewer/linkPreviewService";
import {FabButtonsComponent} from "./components/fabButtonsComponent/fabButtonsComponent";
import {ChromeMessagingService} from "../services/browserMessagingService/chromeMessagingService";
import {DocumentComponent} from "./components/injectionAreaComponent/documentComponent";
import {InjectionAreaComponent} from "./components/injectionAreaComponent/injectionAreaComponent";
import {CheckQuickButtonSettingChromeCommandHandler} from "./commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {CheckCreateNoteSettingChromeCommandHandler} from "./commandHandlers/checkCreateNoteSettingChromeCommandHandler";
import {CheckHighlightSettingChromeCommandHandler} from "./commandHandlers/checkHighlightSettingChromeCommandHandler";
import {ToolTipMenu} from "./components/tooltipComponent/toolTipsMenu";

const contentScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<DocumentComponent>(DocumentComponent).toSelf().inSingletonScope();
    bind<PopupContainer>(PopupContainer).toSelf().inSingletonScope();
    bind<InjectionAreaComponent>(InjectionAreaComponent).toSelf().inSingletonScope();
    bind<FabButtonsComponent>(FabButtonsComponent).toSelf().inSingletonScope();

    bind<ToolTipMenu>(ToolTipMenu).toSelf().inTransientScope();

    bind<LinkPreview>(LinkPreview).toSelf();

    bind<ChromeMessagingService>(ChromeMessagingService).toSelf();

    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(CheckQuickButtonSettingChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(CheckHighlightSettingChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(CheckCreateNoteSettingChromeCommandHandler);

    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(GetLinkPreviewChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(JumpToQuoteTextChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(RemoveAllHighlightChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(ToggleExtensionPopupChromeCommandHandler);
  }
);

export default contentScriptContainer;
