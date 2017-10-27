export interface IContentScriptComponent {
  view: any;

  initialize(parentComponent: IContentScriptComponent, ...args);
}
