import {Directive, ElementRef, Input, OnInit} from "@angular/core";

declare const $: any;

@Directive({
  selector: 'image-svg'
})
export class ImageSvgDirective implements OnInit {
  @Input() src: string;

  constructor(private element: ElementRef) {

  }

  ngOnInit() {
    let $img = $(this.element.nativeElement);
    let imgURL = this.src;

    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      let $svg = $(data).find('svg');

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      $img.append($svg);
    }, 'xml');
  }
}
