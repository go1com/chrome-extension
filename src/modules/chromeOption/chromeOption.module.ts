import { NgModule } from "@angular/core";
import { ChromeOptionComponent } from "./chromeOption/chromeOption.component";
import { RouterModule } from "@angular/router";
import { Go1CoreModule } from "../go1core/go1core.module";
import { CommonModule } from "@angular/common";
import { chromeOptionRoutes } from "./chromeOption.route";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ChromeOptionComponent
  ],
  exports: [
    ChromeOptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(chromeOptionRoutes),

    Go1CoreModule
  ],
  providers: []
})
export class ChromeOptionModule {

}
