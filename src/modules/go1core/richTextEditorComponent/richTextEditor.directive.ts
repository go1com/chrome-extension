import {Directive, ElementRef, Input, Renderer2, forwardRef, AfterViewInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import Medium from './medium';

@Directive({
  selector: '[rich-text-editor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorDirective),
      multi: true
    }
  ],
})
export class RichTextEditorDirective implements ControlValueAccessor, AfterViewInit {
  autoCompleteString: any;
  autoCompleteStarted: any;

  writeValue(obj: any): void {
    this._value = obj;
    if (this.editor)
      this.editor.value(obj);
  }

  setDisabledState(isDisabled: boolean): void {

  }

  @Input() placeholder: string = '';

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
    this.editor = new Medium({
      element: this.element,
      mode: Medium.richMode,
      placeholder: this.placeholder,
      onKeyUp: (event) => {
        if (event.key === '@') {
          this.startProcessingAutocomplete(event.key);
          return;
        }

        if (event.key === '=') {
          this.stopProcessingAutocomplete(event.key);
          return;
        }

        console.log(event);
        this.processKeyUp(event.key);
      },
    });

    this.element.addEventListener('keyup', () => {
      this.value = this.editor.value();
    });
  }

  /**
   * On component destroy
   */
  ngOnDestroy() {
    if (this.editor) {
      setTimeout(() => {
        this.editor.destroy();
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

  private startProcessingAutocomplete(key) {
    this.autoCompleteStarted = true;
    this.autoCompleteString = '';
  }

  private stopProcessingAutocomplete(key) {
    this.autoCompleteStarted = false;
    this.autoCompleteString = '';
  }

  private processKeyUp(key) {
    if (!this.autoCompleteStarted) {
      return;
    }

    this.autoCompleteString += key;

    console.log('searching for auto complete: ', this.autoCompleteString);
  }
}
