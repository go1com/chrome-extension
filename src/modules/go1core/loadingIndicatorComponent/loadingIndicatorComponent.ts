import {Component, Input} from "@angular/core";

@Component({
  selector: 'loading-indicator',
  templateUrl: './loadingIncidator.html'
})
export class LoadingIndicatorComponent{
  @Input() colorScheme: any;
}
