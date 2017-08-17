import { Pipe, PipeTransform } from '@angular/core';
import configuration from "../../../environments/configuration";

@Pipe({
  name: 'currentChromePage',
  pure: false
})
export class CurrentChromePageOnlyPipe implements PipeTransform {
  transform(items: any[]): any {
    return items.filter(discussionTopic => discussionTopic.item === configuration.currentChromeTab.url);
  }
}
