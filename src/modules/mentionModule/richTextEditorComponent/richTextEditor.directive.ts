import {
  Directive, ElementRef, Input, Renderer2, forwardRef, AfterViewInit, EventEmitter, Output,
  Component
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {TCMention} from './mention-plugin';
import {UserService} from "../../membership/services/user.service";

declare const MediumEditor: any;
declare const $: any;

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

  @Input() placeholder = '';

  @Input() mentionedUsers: any[] = [];
  @Output() mentionedUsersChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

  editor: any;

  element: any;

  getUserAutoCompleteTimeout: any;

  private _value: string;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this._value);
    this.onTouched();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  setDisabledState(isDisabled: boolean): void {

  }

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private userService: UserService) {
    this.element = elementRef.nativeElement;
    this.renderer.setAttribute(this.element, 'contenteditable', 'true');
  }

  async ngAfterViewInit() {
    const component = this;
    this.editor = new MediumEditor(this.element, {
      toolbar: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'quote'
        ]
      },
      placeholder: {
        text: this.placeholder
      },
      extensions: {
        mention: new TCMention({
          async renderPanelContent(panelEl, currentMentionText, selectMentionCallback) {
            if (this.getUserAutoCompleteTimeout) {
              clearTimeout(this.getUserAutoCompleteTimeout);
            }

            this.getUserAutoCompleteTimeout = setTimeout(async () => {
              const query = currentMentionText.replace(/@/g, '');

              const availableUsers = await component.userService.getUserAutoComplete(query);

              const listElem = $('<ul class="mention-list"></ul>');

              availableUsers.forEach(user => {
                const item = $(`<li data-user-id="${user.rootId}">${user.name} <em>${user.mail}</em></li>`);
                item.data('user', user);
                item.on('click', function () {
                  const userData = $(this).data('user');
                  selectMentionCallback(`${userData.name.replace(' ', '')}`);
                  component.onUserMentioned(user);
                  component.value = component.editor.getContent();
                });
                listElem.append(item);
              });

              $(panelEl).empty();
              $(panelEl).append(listElem);

              clearTimeout(this.getUserAutoCompleteTimeout);
            });
          }
        })
      }
    });

    this.element.addEventListener('keyup', () => {
      this.value = this.editor.getContent();
    });

    this.element.addEventListener('blur', () => {
      this.value = this.editor.getContent();
    });

    setTimeout(() => {
      this.editor.pasteHTML(this.value);
      this.value = this.editor.getContent();
    }, 200);
  }

  onUserMentioned(user) {
    this.mentionedUsers.push(user);
    this.mentionedUsersChanged.emit(this.mentionedUsers);
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

  onChange(text) {
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
