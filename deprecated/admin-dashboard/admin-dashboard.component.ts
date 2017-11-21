import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoService} from "../core/services/lo.service";
import {Course} from "../core/models/course";
import {Module} from "../core/models/module";
import {UserService} from "../../modules/membership/services/user.service";
import {Li} from "../core/models/li";


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  providers: [LoService],
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private courses: Array<Course>;
  private modules: Array<Module>;
  private course: Course;
  private module: Module;
  private liTitle: string;
  private courseSetting: any;
  private moduleSetting: any;
  private query: string;
  private loading: boolean;
  private user;
  private activeInstance;

  constructor(private loService: LoService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    const self = this;
    this.userService.currentUser.subscribe((user) => {
      if (user.id) {
        this.user = user;
        if (this.user.accounts.length > 1) {
          this.activeInstance = this.user.accounts.find(account => {
            return account.instance.id === localStorage.getItem('currentActivePortalId');
          }).instance;
        }

        this.courseSetting = {
          query: '',
          loading: false,
          items: [],
          displayField: '$title',
          placeholder: 'Search for an existing course',
          onSelect: function (item) {
            this.query = item.$title;
            this.items = [item];
            self.moduleSetting.items = item.$modules;
            self.moduleSetting.query = '';
            self.course = item;
          },
          onKeyUp: function (query) {
            this.loading = true;
            self.loService.fetchCourses(query)
              .subscribe((courses: Array<Course>) => {
                this.items = courses;
                this.loading = false;
              });
          },
          onAddNew: function (query) {
            if (query) {
              self.loService.createCourse(query, user)
                .subscribe((res) => {
                  self.course = new Course(res.id, query, '', []);
                  this.items.push(self.course);
                });
            }
          }
        };
        this.moduleSetting = {
          query: '',
          loading: false,
          items: [],
          displayField: '$title',
          placeholder: 'Search for an existing module',
          onSelect: function (item) {
            this.query = item.$title;
            this.items = [item];
            self.module = item;
          },
          onKeyUp: function (query) {
            try {
              this.items = self.course.$modules.filter((m) => {
                return m.$title.toLowerCase().indexOf(query.toLowerCase()) > -1;
              });
            } catch (e) {
              this.items = [];
            }
          },
          onAddNew: function (query) {
            if (query) {
              self.loService.createModule(self.course, query, user)
                .subscribe((res) => {
                  self.module = new Module(res.id, query, '', []);
                  this.items.push(self.module);
                });
            }
          }
        }
        this.loService.fetchCourses('')
          .subscribe((courses: Array<Course>) => {
            this.courseSetting.items = courses;
          });
      }
    });
  }

  private submit(): void {
    if (this.course && this.module && this.liTitle) {
      this.loService.createLi(this.course, this.module, new Li(null, this.liTitle, ''), this.user)
        .subscribe(res => {
          let user: any;
          this.userService.currentUser.subscribe(u => {
            user = u;
          });
          this.router.navigate(['/complete'], {
            queryParams:
              {
                title: 'Learning item created',
                redirectMask: 'View your learning item',
                redirect: `http://dev.mygo1.com/p/#/token?token=${user.uuid}&destination=app/course/${this.course.$id}`
              }
          });
        })
    }
  }
}
