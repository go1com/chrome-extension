import {ContainerModule, interfaces} from "inversify";
import {PopupContainer} from "./components/popupContainerComponent/popupContainer";
import {IChromeCommandHandler, IChromeCommandHandlerSymbol} from "../services/chromeCommandHandlerService/IChromeCommandHandler";
import {CloseExtensionPopupChromeCommandHandler} from "./commandHandlers/CloseExtensionPopupChromeCommandHandler";
import {GetLinkPreviewChromeCommandHandler} from "./commandHandlers/GetLinkPreviewChromeCommandHandler";
import {JumpToQuoteTextChromeCommandHandler} from "./commandHandlers/jumpToQuoteTextChromeCommandHandler";
import {RemoveAllHighlightChromeCommandHandler} from "./commandHandlers/removeAllHighlightChromeCommandHandler";
import {ShowExtensionPopupChromeCommandHandler} from "./commandHandlers/ShowExtensionPopupChromeCommandHandler";
import {ToggleExtensionPopupChromeCommandHandler} from "./commandHandlers/ToggleExtensionPopupChromeCommandHandler";
import {LinkPreview} from "../modules/linkPreviewer/linkPreviewService";
import {FabButtonsComponent} from "./components/fabButtonsComponent/fabButtonsComponent";
import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";

const contentScriptContainer = new ContainerModule(
  (bind: interfaces.Bind,
   unbind: interfaces.Unbind,
   isBound: interfaces.IsBound,
   rebind: interfaces.Rebind) => {

    bind<PopupContainer>(PopupContainer).toSelf().inSingletonScope();
    bind<Go1ExtensionInjectionArea>(Go1ExtensionInjectionArea).toSelf().inSingletonScope();
    bind<FabButtonsComponent>(FabButtonsComponent).toSelf().inSingletonScope();
    bind<LinkPreview>(LinkPreview).toSelf();

    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(CloseExtensionPopupChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(GetLinkPreviewChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(JumpToQuoteTextChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(RemoveAllHighlightChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(ShowExtensionPopupChromeCommandHandler);
    bind<IChromeCommandHandler>(IChromeCommandHandlerSymbol).to(ToggleExtensionPopupChromeCommandHandler);
  }
);

export default contentScriptContainer;
