import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2, forwardRef, AfterViewInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare const CKEDITOR: any;

@Directive({
  selector: '[ckeditor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkeditorDirective),
      multi: true
    }
  ],
})
export class CkeditorDirective implements ControlValueAccessor, AfterViewInit {
  writeValue(obj: any): void {
    this._value = obj;
    if (this.editor)
      this.editor.setData(obj);
  }

  setDisabledState(isDisabled: boolean): void {

  }

  editor: any;
  element: any;
  private _value: string;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
    this.element = elementRef.nativeElement;
    this.renderer.setAttribute(this.element, 'contenteditable', 'true');
  }

  async ngAfterViewInit() {
    // CKEditor inline
    this.editor = CKEDITOR.inline(this.element, {
      toolbar: 'Custom',
      toolbar_Custom: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike' ] }
      ],
      height: 150,
      minHeight: '150px'
    });

    // Set initial value
    this.editor.setData(this.value);


    // CKEditor change event
    this.editor.on('change', () => {
      this.onTouched();
      this.value = this.editor.getData();
    });
  }

  /**
   * On component destroy
   */
  ngOnDestroy() {
    if (this.editor) {
      setTimeout(() => {
        this.editor.removeAllListeners();
        this.editor.destroy();
        this.editor = null;
      });
    }
  }

  onChange(_) {
  }

  onTouched() {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
