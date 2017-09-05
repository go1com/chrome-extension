import {Directive, ElementRef} from '@angular/core';

declare const $: any;

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(this.el.nativeElement).focus();
  }
}
