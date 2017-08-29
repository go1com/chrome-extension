import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {RichTextEditorDirective} from "./richTextEditorComponent/richTextEditor.directive";
import {MembershipModule} from "../membership/membership.module";

@NgModule({
  declarations: [
    RichTextEditorDirective
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,

    Go1CoreModule,
    MembershipModule
  ],
  providers: [
  ],
  exports: [
    RichTextEditorDirective
  ]
})
export class MentionModule {

}
