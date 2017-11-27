import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

declare const $: any;

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit, AfterViewInit {
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(this.el.nativeElement).focus();
  }
}
