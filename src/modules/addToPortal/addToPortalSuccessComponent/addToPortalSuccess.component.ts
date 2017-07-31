import {Component} from "@angular/core";
import configuration from "../../../environments/configuration";
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'add-to-portal-success',
  templateUrl: '../../../views/addToPortalSuccess.pug'
})
export class AddToPortalSuccessComponent {
  courses: any[];
  selectedCourseIds: any[];

  constructor(private router: Router) {
    this.courses = [];
    this.selectedCourseIds = [];
  }

  async ngOnInit() {
    this.courses = [{
      id: 1,
      name: 'fake course 1'
    }, {
      id: 2,
      name: 'fake course 2'
    }, {
      id: 3,
      name: 'fake course 3'
    }, {
      id: 4,
      name: 'fake course 4'
    }, {
      id: 5,
      name: 'fake course 5'
    }];
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }

  checkSelection(course) {
    return this.selectedCourseIds.indexOf(course.id) > -1;
  }

  toggleSelection(course) {
    if (this.checkSelection(course)) {
      this.selectedCourseIds = _.without(this.selectedCourseIds, course.id);
    } else {
      this.selectedCourseIds.push(course.id);
    }
  }
}
