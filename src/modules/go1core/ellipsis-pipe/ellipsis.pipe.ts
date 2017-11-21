import {Injectable, Pipe} from '@angular/core';

@Injectable()
export class EllipsisService {
  transform(val, args) {
    if (!val || args === undefined) {
      return val;
    }

    if (val.length > args) {
      return val.substring(0, args - '...'.length) + '...';
    } else {
      return val;
    }
  }
}

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe {
  constructor(private ellipsisService: EllipsisService) {

  }

  transform(val, args) {
    return this.ellipsisService.transform(val, args);
  }
}
