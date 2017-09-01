//http://plnkr.co/edit/KQM31HTubn0LfL7jSP5l?p=info
//https://twitter.github.io/typeahead.js/examples/
//https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview
import {
  Component, /*DynamicComponentLoader,*/
  ElementRef,
  Input,
  OnInit,
  forwardRef,
  ViewEncapsulation
} from '@angular/core';
import {NgModel, ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {PropertyHandler} from "./PropertyHandler";

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoComplete),
  multi: true
};

@Component({
  selector: 'typeahead',
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  template: `
    <span class="twitter-typeahead" style="position: relative;display: inline-block;"
          (click)="clickedInTypeHead($event)">
    <span [ngClass]="{'input-container': isDataLoading}">
      <input type="text" [placeholder]="typeAheadSetup && typeAheadSetup.placeHolder ? typeAheadSetup.placeHolder : ''"
             class="ng2typehead typeahead tt-hint input-container" value="" (keyup)="onInputChange($event)"
             (focus)="enable= true;" [(ngModel)]="autoCompleteSelectedLabel"/>\n\
    </span>
    <input type="text" style="display:none" [(ngModel)]="value"/>
    <pre aria-hidden="true"
         style="position: absolute; visibility: hidden; white-space: pre; font-family: Arial; font-size: 22px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;">{{autoCompleteSelectedLabel}}</pre>    
    <div class="tt-dropdown-menu1 tt-menu tt-open" *ngIf="dataList && dataList.length && enable">
            <div class="typehead-item1 tt-suggestion" *ngFor="let item of dataList"
                 [ngClass]="{'active': isActive(item)}">
              <div class=" tt-cursor" *ngIf="!typeAheadSetup.customTemplate" (click)="selectedItem(item)">
              <div *ngIf="!typeAheadSetup.isMultiselect">{{getLabel(item)}}{{typeAheadSetup.isMultiselect}}</div>
              <div *ngIf="typeAheadSetup.isMultiselect">
                <input type="checkbox" [checked]="isActive(item) ? true: null" value=""> 
                {{getLabel(item)}}</div>
              </div>
              <div class=" tt-cursor" *ngIf="typeAheadSetup.customTemplate" (click)="selectedItem(item)">
                <html-outlet [html]="typeAheadSetup.customTemplate" [item]="item"></html-outlet>
              </div>
            </div>
    </div>
   </span>
  `,
  styleUrls: [`./typeahead.component.scss`]
})
export class AutoComplete implements OnInit, ControlValueAccessor {
  @Input('typeAheadSetup') typeAheadSetup: TypeHeadSetup;
  dataList: Array<any>;
  type: string; //static or dynamic
  enable: boolean = false;
  isDataLoading: boolean = false;
  template: string;
  selectedObjectItem: any;
  autoCompleteSelectedLabel: any;
  private innerValue: any = '';
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(private propertyHandler: PropertyHandler, private inputEle: ElementRef) {
  }

  ngOnInit() {
    this.dataList = this.typeAheadSetup.staticData ? this.typeAheadSetup.staticData : [];
    this.type = this.typeAheadSetup.type ? this.typeAheadSetup.type : 'dynamic';
    if (this.typeAheadSetup.isMultiselect) {
      window.addEventListener('click', ($event) => {
        this.dataList = [];
      })
    }
//    this.enable = true;
  }

  onInputChange($event: any) {
    let value = $event.target.value;
    this.isDataLoading = true;
    if (this.type === 'static') {
      this.dataList = [];
      let serchPropList = this.typeAheadSetup.searchProperty.split(',');
      if (this.typeAheadSetup.staticData && this.typeAheadSetup.staticData) {
        this.dataList = this.typeAheadSetup.staticData.filter((item) => {
          let isValid = false;
          for (let i = 0; i < serchPropList.length; i++) {
            let originalValue = this.propertyHandler.getValueByProperty(item, serchPropList[i]);
            if (originalValue && originalValue.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
              isValid = true;
            }
          }
          return isValid;
        });
        this.isDataLoading = false;
      }
    } else {
      this.typeAheadSetup.asynchDataCall(value, (dataList: Array<any>) => {
        this.dataList = dataList;
        this.isDataLoading = false;
      });
    }
  }

  getLabel(item: any) {
    return this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.textProperty);
  }

  selectedItem(item: any) {
    this.selectedObjectItem = item;
    if (this.typeAheadSetup.isMultiselect) {
      if (!this.value) {
        this.value = [];
      }
      let isAvailable = this.isActive(item);
      if (isAvailable) {
        let index = this.value.indexOf(this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.valueProperty));
        this.value.splice(index, 1);
      } else {
        this.value.push(this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.valueProperty));
      }
    } else {
      this.value = this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.valueProperty);
      this.autoCompleteSelectedLabel = this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.textProperty);
      this.dataList = [];
    }
    if (this.typeAheadSetup['onSelect']) {
      this.typeAheadSetup['onSelect'](item);
    }
  }


  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.value) {
      this.value = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  //FOR multi select fix
  clickedInTypeHead($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  isActive(item: any) {
    if (!this.typeAheadSetup.isMultiselect) {
      return false;
    }
    return this.value && this.value.indexOf(this.propertyHandler.getValueByProperty(item, this.typeAheadSetup.valueProperty)) !== -1;
  }
}

export interface IView {
  template: string;
}

export interface TypeHeadSetup {
  customTemplate: string;
  placeHolder: string,
  timeDelay: number;
  type: string;
  textProperty: string;
  valueProperty: string;
  searchProperty: string;
  asynchDataCall: any;
  onSelect: any;
  isMultiselect: boolean;
  staticDataFilterkey: any;
  staticData: Array<any>;
}
