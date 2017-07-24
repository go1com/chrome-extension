import {NgModule} from "@angular/core";
import {Go1LinkPreviewComponent} from "./go1LinkPreviewComponent/go1LinkPreview.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    Go1LinkPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    Go1LinkPreviewComponent
  ],
})
export class Go1LinkPreviewModule {

}
