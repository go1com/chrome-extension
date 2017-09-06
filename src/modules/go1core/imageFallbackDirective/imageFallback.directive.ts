import {Directive, ElementRef, Input} from '@angular/core';

declare const $: any;

@Directive({
  selector: 'img'
})
export class ImageFallbackDirective {
  actualImageUrl; // The image to be lazy loaded
  @Input('disabledLazyLoad') disabled: boolean = false;

  @Input('src')
  get src() {
    return this.actualImageUrl;
  }

  set src(val: string) {
    this.actualImageUrl = val;
    this.ngAfterContentInit();
  }

  private imageLoading: boolean = false;
  private imageLoadError: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterContentInit() {
      this.refreshImage();
  }

  loadImage(imageUrl) {
    this.imageLoading = true;
    let promise = new Promise((resolve, reject) => {

      let image = new Image();

      image.onload = () => {
        resolve();
      };
      image.onerror = (error) => {
        reject();
      };

      image.src = imageUrl;
    });

    return promise;
  }

  setImage(image) {
    const element = this.elementRef.nativeElement;
    element.src = image;
  }

  ngOnDestroy() {
  }

  private refreshImage() {
    this.loadImage(this.actualImageUrl)
      .then(() => {
        this.imageLoadError = false;
        this.setImage(this.actualImageUrl);
        $(this.elementRef.nativeElement).show();
      }, () => {
        this.imageLoadError = true;
        $(this.elementRef.nativeElement).hide();
      });
  }
}
