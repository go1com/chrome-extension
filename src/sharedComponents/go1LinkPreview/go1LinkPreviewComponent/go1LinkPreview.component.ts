import {Component, Input} from "@angular/core";

const linkPreviewApiKey = '597334fb87e1dc53999f43b96c08a134948e0f74c86ad';


@Component({
  selector: 'go1-link-preview',
  templateUrl: './go1LinkPreview.component.jade',
  styleUrls: ['./link-preview.component.scss']
})
export class Go1LinkPreviewComponent {
  @Input('linkUrl') linkUrl: any;

  linkPreview: any = {};

  isLoading = false;

  constructor() {

  }

  async ngAfterViewInit() {
    debugger;
    this.isLoading = true;

    this.linkPreview = await fetch(`http://api.linkpreview.net/?key=${linkPreviewApiKey}&q=${this.linkUrl}`)
      .then(response => response.json());

    console.log(this.linkPreview);
    this.isLoading = false;
  }
}
