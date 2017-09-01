import {NgModule, ModuleWithProviders} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {AutoComplete} from "./autocomplete";
import {HtmlOutlet} from "./html-outlet";
import {PropertyHandler} from "./PropertyHandler";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [
    AutoComplete,
    HtmlOutlet
  ],
  exports: [
    AutoComplete,
    HtmlOutlet
  ],
  providers: [PropertyHandler]
})
export class TypeAheadModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TypeAheadModule,
      providers: [
        PropertyHandler
      ]
    };
  }
}
