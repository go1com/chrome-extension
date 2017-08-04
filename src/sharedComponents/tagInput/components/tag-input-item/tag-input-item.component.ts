import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'tag-input-item',
  templateUrl: `./tag-input-item.component.pug`
})
export class TagInputItemComponent {
  @Input() selected: boolean;
  @Input() text: string;
  @Input() index: number;
  @Output() tagRemoved: EventEmitter<number> = new EventEmitter<number>();
  @HostBinding('class.ng2-tag-input-item-selected') get isSelected() { return !!this.selected; }

  constructor() { }

  removeTag(): void {
    this.tagRemoved.emit(this.index);
  }
}
