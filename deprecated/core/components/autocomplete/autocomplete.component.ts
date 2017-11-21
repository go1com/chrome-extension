import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.html',
  styleUrls: ['./autocomplete.scss']
})

export class AutocompleteComponent implements OnInit {
  @Input() query: string;
  @Input() loading: boolean;
  @Input() items: Array<any>;
  @Input() displayField: string;
  @Input() placeholder: string;
  @Output() onSelect = new EventEmitter();
  @Output() onKeyUp = new EventEmitter();
  @Output() onAddNew = new EventEmitter();
  private show: boolean = false;
  private active: number = -1;
  constructor() {
  }
  ngOnInit(): void {
  }

  _onFocus(): void {
    this.show = true;
  }
  _onClickOutside(): void {
    this.show = false;
  }
  _onSelect(item): void {
    this.onSelect.emit(item);
    this.show = false;
  }
  _onKeyUp(event): void {
    event.preventDefault();
    event.stopPropagation();
    switch (event.code) {
      case 'ArrowDown':
        this.active = (this.active === this.items.length)? 0: this.active + 1;
        break;
      case 'ArrowUp':
        this.active = (this.active === 0)? this.items.length: this.active - 1;
        break;
      case 'Enter':
        this._onSelect(this.items[this.active]);
        break;
      default:
        this.onKeyUp.emit(this.query);
    }
  }
  _addNew(): void {
    this.onAddNew.emit(this.query);
    this.show = false;
  }
}
